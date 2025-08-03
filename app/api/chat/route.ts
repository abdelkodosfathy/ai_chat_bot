import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/constants";
import { units } from "@/lib/units";
import { filterUnits, getUnitDetails, getData, bookMeeting } from "@/lib/filter";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  const lastMessage = messages[messages.length - 1]?.content || "";
  const matchedUnits = filterUnits(lastMessage) || [];

  const rawUnits = matchedUnits
    .map((u) => `مساحة: ${u.area}م - سعر/م: ${u.pricePerMeter}ج - الدور: ${u.floor}`)
    .join("\n");

  const fullMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: `الوحدات المتاحة:\n${rawUnits}` },
    ...messages,
  ];

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo-0613",
    messages: fullMessages,
    tools: [
      {
        type: "function",
        function: {
          name: "getUnitDetails",
          description: "عرض تفاصيل وحدة بناءً على المساحة",
          parameters: {
            type: "object",
            properties: {
              area: {
                type: "string",
                description: "المساحة بالمتر، مثل '110' أو '140'",
              },
            },
            required: ["area"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "bookMeeting",
          description: "حجز معاد مع تيم السيلز و تسجيل بيانات العميل وتفضيلاته",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "اسم العميل" },
              phone: { type: "string", description: "رقم تليفون العميل" },
              areaPreference: {
                type: "string",
                description: "نطاق المساحة اللي بيدور عليها العميل، مثال: '100-130'",
              },
              pricePreference: {
                type: "string",
                description: "نطاق السعر للمتر اللي بيفضله العميل، مثال: '10000-15000'",
              },
              paymentType: {
                type: "string",
                enum: ["cash", "installments"],
                description: "طريقة الدفع المفضلة: كاش أو تقسيط",
              },
              installmentYears: {
                type: "number",
                description: "عدد سنوات التقسيط اللي بيفضلها العميل (اختياري)",
              },
            },
            required: ["name", "phone"],
          },
        },
      },      

      {
        type: "function",
        function: {
          name: "getData",
          description: "فلترة الوحدات حسب تفضيلات العميل (المساحة والسعر)",
          parameters: {
            type: "object",
            properties: {
              area: {
                type: "string",
                description: "نطاق المساحة مثل 90-120",
              },
              price: {
                type: "string",
                description: "نطاق السعر مثل 10000-20000 (سعر المتر)",
              },
            },
            required: [],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const responseMessage = completion.choices[0].message;
  const toolCall = responseMessage.tool_calls?.[0];

  // ✅ لو في tool call، نفذ
  if (toolCall) {
    const { name, arguments: argsJSON } = toolCall.function;
    const args = JSON.parse(argsJSON);

    let result;
    if (name === "getUnitDetails") {
      result = getUnitDetails(args.area, units);
    } else if (name === "bookMeeting") {
      result = bookMeeting(args);
    }else if (name === "getData") {

      result = getData(args, units);
    }

    // ✅ أرسل الرسائل بالشكل الصحيح للمرة الثانية
    const followUpMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `الوحدات المتاحة:\n${rawUnits}` },
      ...messages,
      {
        role: "assistant",
        content: "",
        tool_calls: [
          {
            id: toolCall.id,
            type: "function",
            function: {
              name,
              arguments: argsJSON,
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      },
    ];

    const followUp = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-0613",
      messages: followUpMessages,
    });

    const finalReply = followUp.choices[0].message.content;
    return NextResponse.json({ reply: finalReply });
  }

  return NextResponse.json({ reply: responseMessage.content });
}

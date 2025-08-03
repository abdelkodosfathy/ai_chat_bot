"use client";

import Image from "next/image";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages: Message[] = [...messages, userMessage];

    setMessages(updatedMessages);

    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await res.json();

    setMessages([
      ...updatedMessages,
      { role: "assistant", content: data.reply },
    ]);
    setLoading(false);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(messages);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="h-128 w-full max-w-2xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col border border-gray-200">
        <div className="bg-blue-900 text-white px-6 py-4 text-xl font-semibold text-center">
          عماير | مساعدك الذكي
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[500px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                // dir={msg.role === 'user' ? "" : ""}
                dir="rtl"
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-blue-900 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <ReactMarkdown
                  components={{
                    img: ({...props }) => {
                      const rawSrc = props.src;
                      const src =
                        typeof rawSrc === "string" && !rawSrc.startsWith("http")
                          ? `/apartments/${rawSrc}`
                          : rawSrc?.toString();
                      return (
                        <Image
                          {...props}
                          src={src!}
                          alt="صورة الوحدة"
                          width={400}
                          height={300}

                          className="rounded-xl w-full max-w-sm my-2 mx-auto"
                        />
                      );
                    },
                    pre: () => null,
                    code: ({ children }) => (
                      <span className="bg-gray-100 rounded px-1 text-[0.95em] text-gray-800">
                        {children}
                      </span>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center text-sm text-gray-500 animate-pulse">
              جاري كتابة الرد...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-300 p-4 flex items-center gap-2 bg-white">
          <input
            dir="rtl"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك..."
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage(); // دي الفانكشن اللي بتبعت الرسالة
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-full text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900"
            }`}
          >
            {loading ? "...جاري" : "إرسال"}
          </button>

          {/* <button
            type="button"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={saveToGoogleSheet}
          >
            تجربة إرسال بيانات إلى Google Sheets
          </button> */}
        </div>
      </div>
    </main>
  );
}

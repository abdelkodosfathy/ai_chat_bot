// /app/api/save-to-sheet/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch("https://script.google.com/macros/s/XXX/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    return NextResponse.json({ success: true, message: text });
  } catch (error) {
    console.error("Error saving to sheet:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

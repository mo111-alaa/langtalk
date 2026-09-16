import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { roomName } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: "roomName is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DAILY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "DAILY_API_KEY is missing" },
        { status: 500 }
      );
    }

    // 7 minutes from now
    const expiration =
      Math.floor(Date.now() / 1000) + 7 * 60;

    const response = await fetch(
      "https://api.daily.co/v1/rooms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: roomName,

          privacy: "private",

          properties: {
            exp: expiration,
            max_participants: 2,
            enable_chat: false,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Daily error:", data);

      return NextResponse.json(
        {
          error: "Could not create Daily room",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      room: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
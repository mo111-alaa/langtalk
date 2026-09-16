import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // التأكد من أن المستخدم مسجل الدخول
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { roomName, userName } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: "roomName is required" },
        { status: 400 }
      );
    }

    /*
     * التأكد أن المستخدم عضو في هذه الغرفة
     */
    const { data: match, error: matchError } =
      await supabase
        .from("match_queue")
        .select("id, user_id, room_id, status")
        .eq("user_id", user.id)
        .eq("room_id", roomName)
        .eq("status", "matched")
        .maybeSingle();

    if (matchError) {
      console.error("Match lookup error:", matchError);

      return NextResponse.json(
        { error: "Could not verify room access." },
        { status: 500 }
      );
    }

    if (!match) {
      return NextResponse.json(
        {
          error:
            "You are not a member of this room.",
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.DAILY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "DAILY_API_KEY is missing." },
        { status: 500 }
      );
    }

    /*
     * Token صالح لمدة 7 دقائق
     */
    const expiration =
      Math.floor(Date.now() / 1000) + 7 * 60;

    /*
     * إنشاء Daily Meeting Token
     */
    const response = await fetch(
      "https://api.daily.co/v1/meeting-tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_name:
              userName || "LangTalk User",
            user_id: user.id,
            exp: expiration,
            is_owner: false,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Daily token error:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Could not create Daily meeting token.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      token: data.token,
      expiresAt: expiration,
    });
  } catch (error) {
    console.error(
      "Token route error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
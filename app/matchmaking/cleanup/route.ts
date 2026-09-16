import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const roomId =
      body.roomId?.trim();

    if (!roomId) {
      return NextResponse.json(
        {
          error: "roomId is required",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "cleanup_match_room",
      {
        p_room_id: roomId,
      }
    );

    if (error) {
      console.error(
        "Match cleanup error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not cleanup room.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cleaned: data === true,
    });
  } catch (error) {
    console.error(
      "Unexpected cleanup error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";
import { isPreLaunch, isLaunchDay } from "@/lib/launch";

const CALL_DURATION_SECONDS = 7 * 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /*
     * --------------------------------------------------
     * Launch control
     * --------------------------------------------------
     *
     * Before September 24, 2026:
     * LiveKit tokens cannot be created.
     *
     * September 24:
     * Calls are available for everyone.
     *
     * September 25 onward:
     * Normal system.
     */

    if (isPreLaunch()) {
      return NextResponse.json(
        {
          error:
            "LangTalk calls are not available yet.",
          code: "LANGTALK_NOT_LAUNCHED",
          launchDate: "2026-09-24",
        },
        { status: 403 }
      );
    }

    const launchDay = isLaunchDay();

    // Read request
    const body = await request.json();

    const roomName = body.roomName?.trim();

    const userName =
      body.userName?.trim() || "LangTalk User";

    if (!roomName) {
      return NextResponse.json(
        {
          error: "roomName is required",
        },
        { status: 400 }
      );
    }

    // Find this user's matched session
    const {
      data: match,
      error: matchError,
    } = await supabase
      .from("match_queue")
      .select(
        "id, user_id, room_id, status, started_at"
      )
      .eq("user_id", user.id)
      .eq("room_id", roomName)
      .eq("status", "matched")
      .maybeSingle();

    if (matchError) {
      console.error(
        "Match lookup error:",
        matchError
      );

      return NextResponse.json(
        {
          error: "Match lookup failed.",
        },
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

    /*
     * --------------------------------------------------
     * Create shared session start time if missing
     * --------------------------------------------------
     */

    let startedAt = match.started_at;

    if (!startedAt) {
      const now = new Date().toISOString();

      const {
        data: updatedMatch,
        error: updateError,
      } = await supabase
        .from("match_queue")
        .update({
          started_at: now,
        })
        .eq("id", match.id)
        .is("started_at", null)
        .select(
          "id, user_id, room_id, status, started_at"
        )
        .single();

      if (updateError) {
        console.error(
          "Session start update error:",
          updateError
        );

        /*
         * Another request may have created the
         * session start time at the same moment.
         */
        const {
          data: retryMatch,
          error: retryError,
        } = await supabase
          .from("match_queue")
          .select(
            "id, user_id, room_id, status, started_at"
          )
          .eq("id", match.id)
          .single();

        if (
          retryError ||
          !retryMatch?.started_at
        ) {
          return NextResponse.json(
            {
              error:
                "Unable to start the shared session.",
            },
            { status: 500 }
          );
        }

        startedAt =
          retryMatch.started_at;
      } else {
        startedAt =
          updatedMatch.started_at;
      }
    }

    /*
     * We must have a valid shared start time.
     */
    if (!startedAt) {
      return NextResponse.json(
        {
          error:
            "Unable to determine session start time.",
        },
        { status: 500 }
      );
    }

    /*
     * --------------------------------------------------
     * Calculate shared expiration
     * --------------------------------------------------
     */

    const startedAtMs =
      new Date(startedAt).getTime();

    if (
      Number.isNaN(startedAtMs)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid session start time.",
        },
        { status: 500 }
      );
    }

    const expiresAtMs =
      startedAtMs +
      CALL_DURATION_SECONDS * 1000;

    const expiresAt =
      Math.floor(
        expiresAtMs / 1000
      );

    /*
     * Do not allow an expired room.
     */
    if (
      Date.now() >= expiresAtMs
    ) {
      return NextResponse.json(
        {
          error:
            "This session has expired.",
        },
        { status: 410 }
      );
    }

    /*
     * --------------------------------------------------
     * LiveKit credentials
     * --------------------------------------------------
     */

    const apiKey =
      process.env.LIVEKIT_API_KEY;

    const apiSecret =
      process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "LiveKit API credentials are missing.",
        },
        { status: 500 }
      );
    }

    /*
     * --------------------------------------------------
     * Create LiveKit token
     * --------------------------------------------------
     */

    const token = new AccessToken(
      apiKey,
      apiSecret,
      {
        identity: user.id,
        name: userName,
        ttl: "10m",
      }
    );

    /*
     * Allow camera + microphone
     * and receiving the partner.
     */
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt =
      await token.toJwt();

    /*
     * --------------------------------------------------
     * Return token + shared timer
     * --------------------------------------------------
     */

    return NextResponse.json({
      success: true,
      token: jwt,
      roomName,
      expiresAt,
      startedAt,
      launchDay,
    });
  } catch (error) {
    console.error(
      "LiveKit token error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
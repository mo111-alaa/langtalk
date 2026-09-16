import { NextResponse } from "next/server";
import {
  WebhookReceiver,
} from "livekit-server-sdk";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request
) {
  try {
    const apiKey =
      process.env.LIVEKIT_API_KEY;

    const apiSecret =
      process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "LiveKit credentials are missing.",
        },
        { status: 500 }
      );
    }

    /*
     * IMPORTANT:
     * LiveKit webhook verification
     * requires the raw request body.
     */
    const body =
      await request.text();

    const authorization =
      request.headers.get(
        "Authorization"
      );

    if (!authorization) {
      return NextResponse.json(
        {
          error:
            "Missing Authorization header.",
        },
        { status: 401 }
      );
    }

    const receiver =
      new WebhookReceiver(
        apiKey,
        apiSecret
      );

    const event =
      await receiver.receive(
        body,
        authorization
      );

    console.log(
      "LiveKit webhook:",
      event.event
    );

    /*
     * Events that mean the room/session
     * should be cleaned up.
     */
    const cleanupEvents = [
      "participant_left",
      "participant_connection_aborted",
      "room_finished",
    ];

    if (
      !cleanupEvents.includes(
        event.event
      )
    ) {
      return NextResponse.json({
        received: true,
        event: event.event,
      });
    }

    const roomName =
      event.room?.name;

    if (!roomName) {
      console.log(
        "Webhook has no room name."
      );

      return NextResponse.json({
        received: true,
        cleaned: false,
      });
    }

    const supabase =
      await createClient();

    const {
      error,
    } = await supabase.rpc(
      "cleanup_match_room",
      {
        p_room_id: roomName,
      }
    );

    /*
     * participant_left / room_finished
     * can happen after the first cleanup.
     *
     * If the record is already deleted,
     * that's fine.
     */
    if (error) {
      console.error(
        "Webhook cleanup error:",
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

    console.log(
      `Cleaned LWA room: ${roomName}`
    );

    return NextResponse.json({
      received: true,
      cleaned: true,
      roomName,
    });
  } catch (error) {
    console.error(
      "LiveKit webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid LiveKit webhook.",
      },
      { status: 401 }
    );
  }
}
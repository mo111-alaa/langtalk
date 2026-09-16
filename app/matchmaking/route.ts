import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isPreLaunch,
  isLaunchDay,
} from "@/lib/launch";

const CALL_DURATION_SECONDS = 7 * 60;

type MatchResult = {
  out_matched: boolean;
  out_waiting: boolean;
  out_room_id: string | null;
  out_partner_id: string | null;
};

function serverError(
  message: string,
  status = 500,
  details?: unknown
) {
  if (details) {
    console.error(message, details);
  } else {
    console.error(message);
  }

  return NextResponse.json(
    { error: message },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    /*
     * =====================================================
     * 🔐 AUTHENTICATION
     * =====================================================
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return serverError(
        "Unauthorized.",
        401,
        authError
      );
    }

    /*
     * =====================================================
     * 🚀 LANGTALK LAUNCH CONTROL
     * =====================================================
     *
     * قبل 24/9:
     * لا يوجد Matching.
     *
     * يوم 24/9:
     * Matching مسموح للجميع.
     *
     * بعد 24/9:
     * النظام الطبيعي.
     */
    if (isPreLaunch()) {
      return NextResponse.json(
        {
          error:
            "LangTalk has not launched yet.",
          code: "LANGTALK_NOT_LAUNCHED",
          launchDate: "2026-09-24",
        },
        { status: 403 }
      );
    }

    const launchDay = isLaunchDay();

    /*
     * قراءة البيانات القادمة من Dashboard
     */
    let body: {
      language?: string;
      level?: string | null;
      excludeRoomId?: string | null;
    } = {};

    try {
      body = await request.json();
    } catch {
      // Empty request body is allowed.
    }

    const language =
      body.language?.trim() || "English";

    const level =
      body.level?.trim() || null;

    const excludeRoomId =
      body.excludeRoomId?.trim() || null;

    /*
     * =====================================================
     * 🔒 REMATCH CLEANUP
     * =====================================================
     *
     * إذا كانت هذه عملية Rematch:
     *
     * 1. نقفل الـRoom القديم.
     * 2. نسجلها في used_match_rooms.
     * 3. نحذفها من match_queue.
     * 4. بعدها فقط نبدأ البحث.
     */
    if (excludeRoomId) {
      console.log(
        "Rematch requested. Cleaning old room:",
        excludeRoomId
      );

      const {
        data: cleanupResult,
        error: cleanupError,
      } = await supabase.rpc(
        "cleanup_match_room",
        {
          p_room_id: excludeRoomId,
        }
      );

      if (cleanupError) {
        /*
         * إذا كانت الغرفة حُذفت بالفعل
         * بواسطة الطرف الآخر، فهذا ليس خطأ قاتلًا.
         */
        console.warn(
          "Old room cleanup warning:",
          cleanupError
        );
      } else {
        console.log(
          "Old room cleanup result:",
          cleanupResult
        );
      }
    }

    /*
     * =====================================================
     * 🔎 FIND MATCH
     * =====================================================
     *
     * ملاحظة:
     * launchDay يتم إرساله إلى find_match لاحقًا
     * بعد تعديل الـ RPC في Supabase.
     *
     * حاليًا نمرر نفس المعاملات الموجودة في النظام.
     */
    const {
      data,
      error: matchError,
    } = await supabase.rpc(
      "find_match",
      {
        p_language: language,
        p_level: level,
        p_exclude_room_id:
          excludeRoomId,
      }
    );

    if (matchError) {
      console.error(
        "find_match RPC error:",
        matchError
      );

      /*
       * لا توجد مكالمات مجانية
       *
       * في Launch Day:
       * سيتم تعديل find_match في Supabase
       * بحيث لا يظهر هذا الخطأ أصلًا.
       */
      if (
        matchError.message?.includes(
          "NO_CREDITS"
        )
      ) {
        return NextResponse.json(
          {
            error:
              launchDay
                ? "Launch Day credit handling is not configured yet."
                : "No free calls remaining.",
            code: "NO_CREDITS",
            details:
              matchError.message,
          },
          { status: 402 }
        );
      }

      /*
       * Profile غير موجود
       */
      if (
        matchError.message?.includes(
          "PROFILE_NOT_FOUND"
        )
      ) {
        return NextResponse.json(
          {
            error:
              "User profile not found.",
            code:
              "PROFILE_NOT_FOUND",
            details:
              matchError.message,
          },
          { status: 404 }
        );
      }

      /*
       * فشل تحديث الرصيد
       */
      if (
        matchError.message?.includes(
          "CREDIT_UPDATE_FAILED"
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Could not update free call credits.",
            code:
              "CREDIT_UPDATE_FAILED",
            details:
              matchError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Could not run matchmaking.",
          details:
            matchError.message,
          code:
            matchError.code,
          hint:
            matchError.hint,
          detailsFromSupabase:
            matchError.details,
        },
        { status: 500 }
      );
    }

    /*
     * =====================================================
     * 📦 قراءة نتيجة find_match
     * =====================================================
     *
     * الدالة الجديدة تستخدم:
     *
     * out_matched
     * out_waiting
     * out_room_id
     * out_partner_id
     */
    const result =
      data?.[0] as
        | MatchResult
        | undefined;

    const matched =
      result?.out_matched ?? false;

    const waiting =
      result?.out_waiting ?? false;

    const roomId =
      result?.out_room_id ?? null;

    const partnerId =
      result?.out_partner_id ?? null;

    /*
     * =====================================================
     * 🆕 MATCH FOUND
     * =====================================================
     */
    if (matched && roomId) {
      /*
       * حماية إضافية:
       *
       * إذا عاد لأي سبب الـRoom القديم،
       * لا ندخله.
       */
      if (
        excludeRoomId &&
        roomId === excludeRoomId
      ) {
        console.error(
          "SECURITY: find_match returned the excluded room."
        );

        return NextResponse.json({
          matched: false,
          waiting: true,
          roomId: null,
          partnerId: null,
          retry: true,
        });
      }

      const expiresAt =
        Math.floor(
          Date.now() / 1000
        ) +
        CALL_DURATION_SECONDS;

      return NextResponse.json({
        matched: true,
        waiting: false,
        roomId,
        partnerId,
        expiresAt,
        launchDay,
      });
    }

    /*
     * =====================================================
     * ⏳ WAITING
     * =====================================================
     */
    if (waiting) {
      return NextResponse.json({
        matched: false,
        waiting: true,
        roomId: null,
        partnerId: null,
        launchDay,
      });
    }

    /*
     * =====================================================
     * FALLBACK
     * =====================================================
     *
     * في حالة وجود Room حالي للمستخدم،
     * نتحقق أنه ليس Room محظورًا.
     */
    const {
      data: currentMatches,
      error:
        currentMatchError,
    } = await supabase
      .from("match_queue")
      .select(
        "room_id, status, started_at, created_at"
      )
      .eq("user_id", user.id)
      .eq("status", "matched")
      .not(
        "room_id",
        "is",
        null
      )
      .gt(
        "started_at",
        new Date(
          Date.now() -
            CALL_DURATION_SECONDS *
              1000
        ).toISOString()
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10);

    if (currentMatchError) {
      console.error(
        "Current match lookup error:",
        currentMatchError
      );
    }

    /*
     * نبحث عن أول Room صالح
     * وليس الـRoom المستبعد.
     */
    const validMatch =
      currentMatches?.find(
        (match) =>
          match.room_id &&
          match.room_id !==
            excludeRoomId
      );

    if (
      validMatch?.room_id
    ) {
      let expiresAt:
        | number
        | null = null;

      if (
        validMatch.started_at
      ) {
        const startedAtMs =
          new Date(
            validMatch.started_at
          ).getTime();

        const expiresAtMs =
          startedAtMs +
          CALL_DURATION_SECONDS *
            1000;

        if (
          Date.now() >=
          expiresAtMs
        ) {
          return NextResponse.json({
            matched: false,
            waiting: false,
            expired: true,
            launchDay,
          });
        }

        expiresAt =
          Math.floor(
            expiresAtMs / 1000
          );
      }

      return NextResponse.json({
        matched: true,
        waiting: false,
        roomId:
          validMatch.room_id,
        partnerId: null,
        expiresAt,
        launchDay,
      });
    }

    /*
     * =====================================================
     * ⏳ لا يوجد Match حالي
     * =====================================================
     */
    return NextResponse.json({
      matched: false,
      waiting: true,
      roomId: null,
      partnerId: null,
      launchDay,
    });
  } catch (error) {
    console.error(
      "Unexpected matchmaking error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
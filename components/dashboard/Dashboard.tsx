"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalization } from "@/components/ui/LocalizationProvider";
import type { LaunchStatus } from "@/lib/launch";

interface DashboardProps {
  email: string;
  country: string;
  credits: number;
  targetLanguage: string;
  level: string;
  nativeLanguage: string;
  launchStatus: LaunchStatus;
  onStartPractice?: () => void;
}

type MatchResponse = {
  matched?: boolean;
  waiting?: boolean;
  roomId?: string;
  partnerId?: string;
  expiresAt?: number;
  expired?: boolean;
  error?: string;
  details?: string;
  code?: string;
  hint?: string;
  detailsFromSupabase?: string;
};

export default function Dashboard({
  email,
  country,
  credits,
  targetLanguage,
  level,
  nativeLanguage,
  launchStatus,
  onStartPractice,
}: DashboardProps) {
  const { t } = useLocalization();
  const router = useRouter();

  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const rematchStartedRef = useRef(false);

  const excludeRoomIdRef = useRef<string | null>(null);

  const isArabic =
    nativeLanguage?.toLowerCase() === "arabic" ||
    nativeLanguage?.toLowerCase() === "ar";

  const direction = isArabic ? "rtl" : "ltr";

  const displayLanguage =
    targetLanguage || "English";

  const displayLevel =
    level || "Intermediate";

  /*
    ---------------------------------------------------------
    LAUNCH STATUS
    ---------------------------------------------------------
  */

  const isPreLaunch =
    launchStatus === "prelaunch";

  const isLaunchDay =
    launchStatus === "launch-day";

  const canPractice =
    isLaunchDay || launchStatus === "live";

  /*
    قبل 24/9:
    لا نريد أي Rematch تلقائي.
  */
  useEffect(() => {
    if (isPreLaunch) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      setSearching(false);
      setMessage("");
      setError("");

      return;
    }
  }, [isPreLaunch]);

  /* =========================================================
     CLEANUP POLLING
  ========================================================= */

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  /* =========================================================
     FIND PARTNER
  ========================================================= */

  async function findPartner(
    excludedRoomId?: string | null
  ) {
    /*
      حماية إضافية من تشغيل الـ matchmaking
      قبل تاريخ الإطلاق.
    */
    if (isPreLaunch) {
      setSearching(false);
      setMessage("");
      setError("");

      return;
    }

    if (searching) {
      return;
    }

    if (!targetLanguage || !level) {
      setError(
        isArabic
          ? "لغة التعلم أو المستوى غير موجود. يرجى إكمال إعداد الحساب."
          : "Your target language or level is missing. Please complete onboarding."
      );

      return;
    }

    setSearching(true);
    setError("");

    setMessage(
      isArabic
        ? `جاري البحث عن متعلم للغة ${displayLanguage} في مستوى ${displayLevel}...`
        : `Finding a ${displayLanguage} learner at ${displayLevel} level...`
    );

    try {
      const response = await fetch(
        "/matchmaking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: targetLanguage,
            level: level,
            excludeRoomId:
              excludedRoomId || null,
          }),
        }
      );

      const data: MatchResponse =
        await response.json();

      if (!response.ok) {
        console.error(
          "Matchmaking API error:",
          data
        );

        throw new Error(
          data.details ||
            data.detailsFromSupabase ||
            data.hint ||
            data.error ||
            (isArabic
              ? "تعذر بدء البحث عن شريك."
              : "Could not start matchmaking.")
        );
      }

      /* =====================================================
         MATCH FOUND
      ===================================================== */

      if (
        data.matched === true &&
        typeof data.roomId === "string" &&
        data.roomId.trim() !== ""
      ) {
        /*
          حماية إضافية:
          إذا أعاد الـbackend نفس الغرفة القديمة
          رغم وجود excludeRoomId، لا ندخلها.
        */
        if (
          excludedRoomId &&
          data.roomId === excludedRoomId
        ) {
          console.warn(
            "Matchmaking returned the excluded room. Retrying..."
          );

          setSearching(false);

          setMessage(
            isArabic
              ? "يتم إنشاء غرفة جديدة..."
              : "Creating a new room..."
          );

          window.setTimeout(() => {
            findPartner(excludedRoomId);
          }, 300);

          return;
        }

        setMessage(
          isArabic
            ? "تم العثور على شريك! جاري بدء المكالمة..."
            : "Partner found! Starting your call..."
        );

        if (pollingRef.current) {
          clearInterval(
            pollingRef.current
          );

          pollingRef.current = null;
        }

        router.push(
          `/call?room=${encodeURIComponent(
            data.roomId
          )}`
        );

        return;
      }

      /* =====================================================
         WAITING
      ===================================================== */

      if (data.waiting === true) {
        setMessage(
          isArabic
            ? `أنت في قائمة الانتظار لمتعلم آخر للغة ${displayLanguage} في مستوى ${displayLevel}.`
            : `You're waiting for another ${displayLanguage} learner at ${displayLevel} level...`
        );

        startPolling(
          excludedRoomId || null
        );

        return;
      }

      throw new Error(
        isArabic
          ? "حدثت استجابة غير متوقعة."
          : "Unexpected matchmaking response."
      );
    } catch (err) {
      console.error(
        "Matchmaking error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : isArabic
            ? "حدث خطأ ما."
            : "Something went wrong."
      );

      setSearching(false);
      setMessage("");
    }
  }

  /* =========================================================
     AUTOMATIC REMATCH
  ========================================================= */

  useEffect(() => {
    /*
      لا تشغل Rematch قبل إطلاق LangTalk.
    */
    if (isPreLaunch) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const shouldRematch =
      params.get("rematch") === "1";

    if (!shouldRematch) {
      return;
    }

    /*
      حماية من تشغيل Rematch مرتين
      بسبب React Strict Mode.
    */
    if (rematchStartedRef.current) {
      return;
    }

    rematchStartedRef.current = true;

    /*
      الحصول على الغرفة القديمة التي
      خرجنا منها بسبب الخطأ.
    */
    const excludedRoomId =
      params.get("excludeRoom");

    excludeRoomIdRef.current =
      excludedRoomId || null;

    /*
      إزالة بيانات الـRematch من الرابط
      بعد قراءتها.
    */
    window.history.replaceState(
      {},
      "",
      "/dashboard"
    );

    /*
      ننتظر قليلًا حتى يتم تحميل
      بيانات Dashboard بشكل طبيعي.
    */
    const timer =
      window.setTimeout(() => {
        findPartner(
          excludedRoomId || null
        );
      }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isPreLaunch]);

  /* =========================================================
     POLLING
  ========================================================= */

  function startPolling(
    excludedRoomId?: string | null
  ) {
    if (isPreLaunch) {
      return;
    }

    if (pollingRef.current) {
      clearInterval(
        pollingRef.current
      );
    }

    pollingRef.current =
      setInterval(async () => {
        /*
          إذا تغيرت حالة الصفحة إلى prelaunch
          أوقف البحث.
        */
        if (isPreLaunch) {
          if (pollingRef.current) {
            clearInterval(
              pollingRef.current
            );

            pollingRef.current = null;
          }

          setSearching(false);
          setMessage("");

          return;
        }

        try {
          const response =
            await fetch(
              "/matchmaking",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  language:
                    targetLanguage,
                  level: level,
                  excludeRoomId:
                    excludedRoomId ||
                    null,
                }),
              }
            );

          const data: MatchResponse =
            await response.json();

          if (!response.ok) {
            console.error(
              "Matchmaking polling API error:",
              data
            );

            return;
          }

          if (
            data.matched === true &&
            typeof data.roomId ===
              "string" &&
            data.roomId.trim() !== ""
          ) {
            /*
              لا تسمح أبدًا بالدخول إلى
              الغرفة التي تم استبعادها.
            */
            if (
              excludedRoomId &&
              data.roomId ===
                excludedRoomId
            ) {
              console.warn(
                "Polling returned excluded room. Ignoring it."
              );

              return;
            }

            if (pollingRef.current) {
              clearInterval(
                pollingRef.current
              );

              pollingRef.current = null;
            }

            setMessage(
              isArabic
                ? "تم العثور على شريك! جاري بدء المكالمة..."
                : "Partner found! Starting your call..."
            );

            router.push(
              `/call?room=${encodeURIComponent(
                data.roomId
              )}`
            );
          }
        } catch (err) {
          console.error(
            "Matchmaking polling error:",
            err
          );
        }
      }, 3000);
  }

  /* =========================================================
     CANCEL SEARCH
  ========================================================= */

  function cancelSearch() {
    if (pollingRef.current) {
      clearInterval(
        pollingRef.current
      );

      pollingRef.current = null;
    }

    setSearching(false);
    setMessage("");
    setError("");

    excludeRoomIdRef.current = null;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main
      dir={direction}
      className="min-h-screen overflow-hidden bg-[#f7f7f5] text-gray-900"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#10231f]"
          >
            LangTalk
            <span className="text-blue-600">
              .
            </span>
          </Link>

          {!isPreLaunch && (
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                isLaunchDay
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : credits > 0
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="text-base">
                🎟️
              </span>

              <span>
                {isLaunchDay
                  ? isArabic
                    ? "المكالمات مجانية اليوم"
                    : "Free calls today"
                  : isArabic
                    ? `${credits} مكالمات مجانية متبقية`
                    : `${credits} free calls remaining`}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPreLaunch
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
              />

              {isPreLaunch
                ? isArabic
                  ? "الإطلاق قريبًا"
                  : "Launching soon"
                : isLaunchDay
                  ? isArabic
                    ? "يوم الإطلاق"
                    : "Launch day"
                  : isArabic
                    ? "مساحتك للممارسة"
                    : "Your practice space"}
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-[#10231f] md:text-7xl">
              {isPreLaunch
                ? isArabic
                  ? "LangTalk يبدأ في 24 سبتمبر"
                  : "LangTalk launches on September 24"
                : isArabic
                  ? "جاهز لمحادثة جديدة؟"
                  : "Ready for a new conversation?"}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              {isPreLaunch
                ? isArabic
                  ? "انتظر حتى 24/9/2026 — سنبدأ مكالمات LangTalk في 24 سبتمبر."
                  : "Please wait until September 24, 2026 — LangTalk calls will start on September 24."
                : isArabic
                  ? "تحدث بحرية مع متعلم آخر للغتك المستهدفة لمدة سبع دقائق، بدون اختيار شريك يدويًا."
                  : "Speak freely with another learner of your target language for seven minutes, without manually choosing a partner."}
            </p>

            {/* =================================================
                PRACTICE / LAUNCH BUTTON
            ================================================= */}

            {isPreLaunch ? (
              <div className="mt-9 max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    🕐
                  </div>

                  <div>
                    <p className="font-bold text-amber-900">
                      {isArabic
                        ? "انتظر حتى 24/9/2026"
                        : "Please wait until September 24, 2026"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      {isArabic
                        ? "سنبدأ مكالمات LangTalk في 24 سبتمبر. يمكنك حاليًا مراجعة إعدادات حسابك."
                        : "LangTalk calls will start on September 24. You can review your account settings meanwhile."}
                    </p>
                  </div>
                </div>
              </div>
            ) : !searching ? (
              <div>
                <button
                  onClick={() => {
                    onStartPractice?.();
                    findPartner();
                  }}
                  disabled={
                    !isLaunchDay &&
                    credits <= 0
                  }
                  className="mt-9 inline-flex items-center justify-center rounded-2xl bg-[#10231f] px-7 py-4 text-base font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#18352f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLaunchDay
                    ? isArabic
                      ? "ابدأ المكالمة المجانية"
                      : "Start free call"
                    : credits > 0
                      ? isArabic
                        ? "ابدأ الممارسة"
                        : t(
                            "startPractice"
                          )
                      : isArabic
                        ? "لا توجد مكالمات مجانية"
                        : "No free calls remaining"}
                </button>

                {isLaunchDay && (
                  <p className="mt-3 text-sm font-medium text-blue-600">
                    {isArabic
                      ? "جميع المكالمات مجانية اليوم — لا يتم خصم أي رصيد."
                      : "All calls are free today — no credits are deducted."}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-9 max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                  <div>
                    <p className="font-bold text-[#10231f]">
                      {message}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {isArabic
                        ? "يبحث LangTalk تلقائيًا عن متعلم مناسب لك. لا تحتاج إلى اختيار أي شخص."
                        : "LangTalk is automatically looking for a suitable learner. You don't need to choose anyone."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={
                    cancelSearch
                  }
                  className="mt-5 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  {isArabic
                    ? "إلغاء البحث"
                    : "Cancel search"}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-5 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* =================================================
              PREVIEW CARD
          ================================================= */}

          <div className="relative">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_70px_rgba(16,35,31,0.08)] md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-gray-400">
                  LangTalk
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isPreLaunch
                      ? "bg-amber-50 text-amber-700"
                      : isLaunchDay
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                  }`}
                >
                  {isPreLaunch
                    ? isArabic
                      ? "قريبًا"
                      : "Coming soon"
                    : isLaunchDay
                      ? isArabic
                        ? "مجاني اليوم"
                        : "Free today"
                      : isArabic
                        ? "متاح"
                        : "Ready"}
                </span>
              </div>

              <div className="mt-10 rounded-3xl bg-[#10231f] p-7 text-white">
                <div className="text-sm text-white/60">
                  {isArabic
                    ? "جلسة المحادثة"
                    : "Conversation session"}
                </div>

                <div className="mt-3 text-5xl font-black tracking-tight">
                  07:00
                </div>

                <div className="mt-2 text-sm text-white/60">
                  {isArabic
                    ? "فيديو + صوت"
                    : "Video + audio"}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoBox
                  label={
                    isArabic
                      ? "اللغة"
                      : "Language"
                  }
                  value={
                    displayLanguage
                  }
                />

                <InfoBox
                  label={
                    isArabic
                      ? "المستوى"
                      : "Level"
                  }
                  value={
                    displayLevel
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-7 md:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">
              {isArabic
                ? "حسابك"
                : "Your account"}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#10231f]">
              {isArabic
                ? "بيانات حسابك"
                : "Your account details"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBox
              label={
                isArabic
                  ? "البريد الإلكتروني"
                  : "Email"
              }
              value={
                email || "—"
              }
            />

            <InfoBox
              label={
                isArabic
                  ? "الدولة"
                  : "Country"
              }
              value={
                country || "—"
              }
            />

            <InfoBox
              label={
                isArabic
                  ? "اللغة الأم"
                  : "Native language"
              }
              value={
                nativeLanguage || "—"
              }
            />

            <InfoBox
              label={
                isArabic
                  ? "اللغة المستهدفة"
                  : "Target language"
              }
              value={
                displayLanguage
              }
            />

            <InfoBox
              label={
                isArabic
                  ? "المستوى"
                  : "Level"
              }
              value={
                displayLevel
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            number="01"
            title={
              isArabic
                ? "مطابقة تلقائية"
                : "Automatic matching"
            }
            text={
              isArabic
                ? "LangTalk يبحث عن متعلم مناسب لك تلقائيًا."
                : "LangTalk automatically finds a suitable learner for you."
            }
          />

          <FeatureCard
            number="02"
            title={
              isArabic
                ? "سبع دقائق"
                : "Seven minutes"
            }
            text={
              isArabic
                ? "جلسة قصيرة ومركزة تساعدك على التحدث بحرية."
                : "A short, focused session designed to get you speaking."
            }
          />

          <FeatureCard
            number="03"
            title={
              isArabic
                ? "فيديو وصوت"
                : "Video & audio"
            }
            text={
              isArabic
                ? "تحدث وجهًا لوجه عندما يتم العثور على شريكك."
                : "Talk face-to-face once your partner is found."
            }
          />
        </div>
      </section>

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">
                {isArabic
                  ? "إعدادات الممارسة"
                  : "Practice settings"}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#10231f]">
                {isArabic
                  ? "هذه هي تفضيلات المطابقة الخاصة بك"
                  : "These are your matching preferences"}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-500">
                {isArabic
                  ? "سيستخدم LangTalk هذه البيانات للعثور على متعلم مناسب لجلسة المحادثة."
                  : "LangTalk uses these details to find a suitable learner for your conversation session."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoBox
                label={
                  isArabic
                    ? "اللغة المستهدفة"
                    : "Target language"
                }
                value={
                  displayLanguage
                }
              />

              <InfoBox
                label={
                  isArabic
                    ? "المستوى"
                    : "Level"
                }
                value={
                  displayLevel
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BALANCE
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <div className="rounded-[2rem] bg-[#10231f] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-white/50">
                {isArabic
                  ? "رصيدك الحالي"
                  : "Your current balance"}
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight">
                {isLaunchDay
                  ? isArabic
                    ? "المكالمات مجانية اليوم"
                    : "Calls are free today"
                  : (
                      <>
                        {credits}{" "}
                        {isArabic
                          ? "مكالمات مجانية"
                          : credits === 1
                            ? "free call"
                            : "free calls"}
                      </>
                    )}
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-white/60">
                {isPreLaunch
                  ? isArabic
                    ? "سيصبح نظام المكالمات متاحًا في 24 سبتمبر 2026."
                    : "The calling system will become available on September 24, 2026."
                  : isLaunchDay
                    ? isArabic
                      ? "يمكنك إجراء المكالمات اليوم بدون خصم أي مكالمات مجانية."
                      : "You can make calls today without using any free-call credits."
                    : isArabic
                      ? "استخدم مكالماتك المجانية للتحدث مع متعلمين آخرين."
                      : "Use your free calls to practice with other learners."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-8 py-6 text-center backdrop-blur">
              <div className="text-5xl font-black">
                {isLaunchDay
                  ? "∞"
                  : credits}
              </div>

              <div className="mt-1 text-sm text-white/60">
                {isPreLaunch
                  ? isArabic
                    ? "تبدأ 24/9"
                    : "Starts Sep 24"
                  : isLaunchDay
                    ? isArabic
                      ? "مجاني اليوم"
                      : "Free today"
                    : isArabic
                      ? "مكالمات متبقية"
                      : "calls remaining"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] px-4 py-4">
      <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>

      <div className="mt-1 break-words font-bold text-[#10231f]">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="text-sm font-black text-blue-600">
        {number}
      </div>

      <h3 className="mt-8 text-xl font-black text-[#10231f]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-500">
        {text}
      </p>
    </div>
  );
}
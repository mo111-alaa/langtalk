"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useLocalParticipant,
  useTracks,
  useConnectionState,
  useRoomContext,
} from "@livekit/components-react";

import "@livekit/components-styles";

import {
  Track,
  ConnectionState,
  RoomEvent,
  ConnectionQuality,
} from "livekit-client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  isPreLaunch,
  isLaunchDay,
} from "@/lib/launch";

const CALL_DURATION_SECONDS = 7 * 60;
const DISCONNECT_GRACE_SECONDS = 10;

/* =========================================================
   CALL INTERFACE
========================================================= */

function CallInterface({
  onSessionEnd,
}: {
  onSessionEnd: (shouldRematch: boolean) => void;
}) {
  const {
    localParticipant,
    isMicrophoneEnabled,
  } = useLocalParticipant();

  const room = useRoomContext();

  const connectionState =
    useConnectionState();

  const cameraTracks = useTracks([
    Track.Source.Camera,
  ]);

  const [micEnabled, setMicEnabled] =
    useState(isMicrophoneEnabled);

  const [
    disconnectSecondsLeft,
    setDisconnectSecondsLeft,
  ] = useState<number | null>(null);

  const disconnectTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const disconnectStartedRef =
    useRef(false);

  /* =========================================================
     CANCEL DISCONNECT TIMER
  ========================================================= */

  function cancelDisconnectTimer() {
    if (
      disconnectTimerRef.current !== null
    ) {
      clearInterval(
        disconnectTimerRef.current
      );

      disconnectTimerRef.current =
        null;
    }

    disconnectStartedRef.current =
      false;

    setDisconnectSecondsLeft(null);
  }

  /* =========================================================
     START 10 SECOND DISCONNECT TIMER
  ========================================================= */

  function startDisconnectTimer() {
    if (disconnectStartedRef.current) {
      return;
    }

    disconnectStartedRef.current =
      true;

    let seconds =
      DISCONNECT_GRACE_SECONDS;

    setDisconnectSecondsLeft(
      seconds
    );

    disconnectTimerRef.current =
      setInterval(() => {
        seconds -= 1;

        setDisconnectSecondsLeft(
          Math.max(0, seconds)
        );

        if (seconds <= 0) {
          if (
            disconnectTimerRef.current !==
            null
          ) {
            clearInterval(
              disconnectTimerRef.current
            );

            disconnectTimerRef.current =
              null;
          }

          /*
            الشريك لم يعد خلال 10 ثوانٍ.

            true = بعد حذف الغرفة القديمة
            ابدأ Match جديد تلقائيًا.
          */
          onSessionEnd(true);
        }
      }, 1000);
  }

  /* =========================================================
     CONNECTION QUALITY + PARTICIPANT EVENTS
  ========================================================= */

  useEffect(() => {
    function handleParticipantDisconnected() {
      console.log(
        "Partner disconnected."
      );

      startDisconnectTimer();
    }

    function handleParticipantConnected() {
      console.log(
        "Partner connected again."
      );

      cancelDisconnectTimer();
    }

    function handleConnectionQualityChanged(
      quality: ConnectionQuality,
      participant: any
    ) {
      if (
        participant.identity ===
        room.localParticipant.identity
      ) {
        return;
      }

      console.log(
        "Partner connection quality:",
        quality
      );

      if (
        quality ===
        ConnectionQuality.Lost
      ) {
        startDisconnectTimer();
      }

      if (
        quality ===
          ConnectionQuality.Good ||
        quality ===
          ConnectionQuality.Excellent
      ) {
        cancelDisconnectTimer();
      }
    }

    room.on(
      RoomEvent.ParticipantDisconnected,
      handleParticipantDisconnected
    );

    room.on(
      RoomEvent.ParticipantConnected,
      handleParticipantConnected
    );

    room.on(
      RoomEvent.ConnectionQualityChanged,
      handleConnectionQualityChanged
    );

    return () => {
      room.off(
        RoomEvent.ParticipantDisconnected,
        handleParticipantDisconnected
      );

      room.off(
        RoomEvent.ParticipantConnected,
        handleParticipantConnected
      );

      room.off(
        RoomEvent.ConnectionQualityChanged,
        handleConnectionQualityChanged
      );

      if (
        disconnectTimerRef.current !==
        null
      ) {
        clearInterval(
          disconnectTimerRef.current
        );

        disconnectTimerRef.current =
          null;
      }
    };
  }, [room]);

  /* =========================================================
     LOCAL RECONNECTING
  ========================================================= */

  useEffect(() => {
    if (
      connectionState ===
      ConnectionState.Reconnecting
    ) {
      console.log(
        "Local connection is reconnecting..."
      );
    }

    if (
      connectionState ===
      ConnectionState.Connected
    ) {
      console.log(
        "Local connection restored."
      );
    }
  }, [connectionState]);

  /* =========================================================
     MICROPHONE
  ========================================================= */

  useEffect(() => {
    setMicEnabled(
      isMicrophoneEnabled
    );
  }, [isMicrophoneEnabled]);

  async function toggleMicrophone() {
    try {
      const nextState =
        !micEnabled;

      await localParticipant.setMicrophoneEnabled(
        nextState
      );

      setMicEnabled(
        nextState
      );
    } catch (error) {
      console.error(
        "Microphone toggle error:",
        error
      );
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">

      {/* =====================================================
          DISCONNECT OVERLAY
      ===================================================== */}

      {disconnectSecondsLeft !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">

          <div className="rounded-2xl bg-[#10231f] px-8 py-7 text-center shadow-2xl">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />

            <h2 className="text-xl font-semibold text-white">
              Connection lost
            </h2>

            <p className="mt-2 text-white/70">
              Waiting for your partner to reconnect...
            </p>

            <div className="mt-4 text-3xl font-bold text-white">
              {disconnectSecondsLeft}s
            </div>

            <p className="mt-3 text-xs text-white/40">
              If your partner does not reconnect,
              you will be matched again.
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          VIDEO AREA
      ===================================================== */}

      <div className="grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-2">

        {cameraTracks.map(
          (trackRef) => (
            <div
              key={`${trackRef.participant.identity}-${trackRef.source}`}
              className="relative min-h-0 overflow-hidden rounded-2xl bg-[#182a26]"
            >
              <VideoTrack
                trackRef={trackRef}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white backdrop-blur">
                {trackRef.participant.isLocal
                  ? "You"
                  : "Partner"}
              </div>
            </div>
          )
        )}

        {cameraTracks.length === 0 && (
          <div className="flex items-center justify-center rounded-2xl bg-[#182a26] text-white/60">
            Connecting camera...
          </div>
        )}

      </div>

      {/* =====================================================
          MICROPHONE
      ===================================================== */}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">

        <button
          onClick={
            toggleMicrophone
          }
          disabled={
            connectionState !==
            ConnectionState.Connected
          }
          className={`rounded-full px-7 py-4 font-semibold shadow-xl transition ${
            micEnabled
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-red-600 text-white hover:bg-red-700"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {micEnabled
            ? "🎤 Mute"
            : "🔇 Unmute"}
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   MAIN CALL PAGE
========================================================= */

export default function CallPage() {
  const [token, setToken] =
    useState("");

  const [roomName, setRoomName] =
    useState("");

  const [error, setError] =
    useState("");

  const [secondsLeft, setSecondsLeft] =
    useState(
      CALL_DURATION_SECONDS
    );

  const [expiresAt, setExpiresAt] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [preLaunch, setPreLaunch] =
    useState(false);

  const [launchDay, setLaunchDay] =
    useState(false);

  const endingSessionRef =
    useRef(false);

  /* =========================================================
     CHECK LAUNCH STATUS
  ========================================================= */

  useEffect(() => {
    const preLaunchNow =
      isPreLaunch();

    const launchDayNow =
      isLaunchDay();

    setPreLaunch(preLaunchNow);
    setLaunchDay(launchDayNow);

    /*
     * قبل 24 سبتمبر:
     * لا نبدأ LiveKit ولا نطلب Token.
     */
    if (preLaunchNow) {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     GET ROOM + TOKEN
  ========================================================= */

  useEffect(() => {
    if (preLaunch) {
      return;
    }

    let mounted = true;

    async function startCall() {
      try {
        const params =
          new URLSearchParams(
            window.location.search
          );

        const room =
          params.get("room");

        if (!room) {
          throw new Error(
            "لم يتم تحديد غرفة الاتصال."
          );
        }

        setRoomName(room);

        const response =
          await fetch(
            "/api/livekit/token",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                roomName: room,
                userName:
                  "LangTalk User",
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.token
        ) {
          throw new Error(
            data.error ||
              "تعذر إنشاء LiveKit token."
          );
        }

        if (mounted) {
          setToken(data.token);

          setExpiresAt(
            data.expiresAt
          );

          setLoading(false);
        }
      } catch (err) {
        console.error(
          "LiveKit call error:",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "حدث خطأ أثناء بدء المكالمة."
          );

          setLoading(false);
        }
      }
    }

    startCall();

    return () => {
      mounted = false;
    };
  }, [preLaunch]);

  /* =========================================================
     CLEANUP ROOM
  ========================================================= */

  async function cleanupRoom() {
    if (!roomName) {
      return;
    }

    try {
      const response =
        await fetch(
          "/matchmaking/cleanup",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              roomId: roomName,
            }),
            keepalive: true,
          }
        );

      if (!response.ok) {
        console.error(
          "Room cleanup failed:",
          await response.text()
        );
      }
    } catch (error) {
      console.error(
        "Room cleanup error:",
        error
      );
    }
  }

  /* =========================================================
     END SESSION
  ========================================================= */

  async function endSession(
    shouldRematch = false
  ) {
    if (endingSessionRef.current) {
      return;
    }

    endingSessionRef.current =
      true;

    /*
      أولًا نحذف الغرفة القديمة.
    */
    await cleanupRoom();

    /*
      إذا كان السبب انقطاع الشريك،
      نذهب إلى Dashboard مع:

      rematch=1
      excludeRoom=الغرفة القديمة

      حتى لا يعود matchmaking
      إلى نفس الغرفة.

      أما انتهاء الـ7 دقائق طبيعيًا،
      فنرجع إلى Dashboard فقط.
    */
    if (shouldRematch) {
      window.location.href =
        `/dashboard?rematch=1&excludeRoom=${encodeURIComponent(
          roomName
        )}`;
    } else {
      window.location.href =
        "/dashboard";
    }
  }

  /* =========================================================
     HANDLE TAB CLOSE / PAGE LEAVE
  ========================================================= */

  useEffect(() => {
    if (!roomName) {
      return;
    }

    function handlePageExit() {
      if (endingSessionRef.current) {
        return;
      }

      endingSessionRef.current =
        true;

      /*
       * المسار الصحيح:
       * /matchmaking/cleanup
       */
      fetch(
        "/matchmaking/cleanup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            roomId: roomName,
          }),
          keepalive: true,
        }
      ).catch(() => {});
    }

    window.addEventListener(
      "pagehide",
      handlePageExit
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        handlePageExit
      );
    };
  }, [roomName]);

  /* =========================================================
     7 MINUTE TIMER
  ========================================================= */

  useEffect(() => {
    if (expiresAt === null) {
      return;
    }

    const sessionExpiresAt =
      expiresAt;

    function updateTimer() {
      const now =
        Math.floor(
          Date.now() / 1000
        );

      const remaining =
        Math.max(
          0,
          sessionExpiresAt -
            now
        );

      setSecondsLeft(
        remaining
      );

      if (remaining <= 0) {
        /*
          انتهاء طبيعي.
          لا نعمل Rematch.
        */
        endSession(false);
      }
    }

    updateTimer();

    const timer =
      setInterval(
        updateTimer,
        1000
      );

    return () => {
      clearInterval(timer);
    };
  }, [expiresAt, roomName]);

  /* =========================================================
     FORMAT TIMER
  ========================================================= */

  function formatTime(
    totalSeconds: number
  ) {
    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  /* =========================================================
     PRE-LAUNCH
  ========================================================= */

  if (preLaunch) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#10231f] px-6 text-white">

        <div className="max-w-lg text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
            🚀
          </div>

          <h1 className="text-3xl font-bold">
            LangTalk is launching soon
          </h1>

          <p className="mt-4 text-white/70">
            Video conversations will be available
            starting September 24, 2026.
          </p>

          <p className="mt-2 text-sm text-white/50">
            Come back on launch day to start
            speaking with language learners
            around the world.
          </p>

          <button
            onClick={() =>
              window.location.href =
                "/dashboard"
            }
            className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
          >
            Back to Dashboard
          </button>

        </div>

      </main>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#10231f] text-white">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />

          <h1 className="text-xl font-semibold">
            Connecting...
          </h1>

          <p className="mt-2 text-white/60">
            Starting your video call
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#10231f] px-6 text-white">

        <div className="max-w-md text-center">

          <h1 className="text-2xl font-bold">
            تعذر بدء المكالمة
          </h1>

          <p className="mt-4 text-white/70">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90"
          >
            إعادة المحاولة
          </button>

        </div>

      </main>
    );
  }

  /* =========================================================
     CALL
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#10231f] text-white">

      <header className="flex h-20 items-center justify-between border-b border-white/10 px-6">

        <div>
          <h1 className="text-xl font-semibold">
            LangTalk
          </h1>

          <p className="text-sm text-white/60">
            1-on-1 conversation
          </p>
        </div>

        <div className="rounded-full bg-white/10 px-5 py-2 text-lg font-semibold">
          {formatTime(
            secondsLeft
          )}
        </div>

      </header>

      <section className="h-[calc(100vh-5rem)] p-4">

        <LiveKitRoom
          token={token}
          serverUrl={
            process.env
              .NEXT_PUBLIC_LIVEKIT_URL
          }
          connect={true}
          video={true}
          audio={true}
          className="h-full overflow-hidden rounded-2xl"
        >

          <CallInterface
            onSessionEnd={
              endSession
            }
          />

          <RoomAudioRenderer />

        </LiveKitRoom>

      </section>

    </main>
  );
}
"use client";

import { useState } from "react";

import CountdownTimer from "./CountdownTimer";
import CallControls from "./CallControls";
import IcebreakerPanel from "./IcebreakerPanel";

interface VideoRoomProps {
  onEnd: () => void;
}

export default function VideoRoom({
  onEnd,
}: VideoRoomProps) {
  const [muted, setMuted] =
    useState(false);

  const [cameraOff, setCameraOff] =
    useState(false);

  const prompts = [
    "What do you enjoy doing in your free time?",
    "What is your favorite movie?",
    "What place would you like to visit?",
  ];

  return (
    <div className="relative min-h-screen bg-gray-950">

      <CountdownTimer
        onComplete={onEnd}
      />

      <IcebreakerPanel
        prompts={prompts}
      />

      <div className="grid min-h-screen grid-cols-1 gap-4 p-4 md:grid-cols-2">

        <div className="flex items-center justify-center rounded-2xl bg-gray-800">

          <div className="text-center text-white">

            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-600 text-3xl">
              You
            </div>

            <p>
              Your camera
            </p>

          </div>

        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gray-800">

          <div className="text-center text-white">

            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-600 text-3xl">
              👤
            </div>

            <p>
              Your partner
            </p>

          </div>

        </div>

      </div>

      <CallControls
        muted={muted}
        cameraOff={cameraOff}
        onMute={() =>
          setMuted(
            !muted
          )
        }
        onCamera={() =>
          setCameraOff(
            !cameraOff
          )
        }
        onEnd={onEnd}
      />

    </div>
  );
}
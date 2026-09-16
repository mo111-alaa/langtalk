"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
} from "lucide-react";

interface CallControlsProps {
  muted: boolean;
  cameraOff: boolean;
  onMute: () => void;
  onCamera: () => void;
  onEnd: () => void;
}

export default function CallControls({
  muted,
  cameraOff,
  onMute,
  onCamera,
  onEnd,
}: CallControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-3 rounded-2xl bg-black/80 p-4">

      <button
        onClick={onMute}
        className="rounded-full bg-gray-700 p-4 text-white"
      >
        {muted ? (
          <MicOff />
        ) : (
          <Mic />
        )}
      </button>

      <button
        onClick={onCamera}
        className="rounded-full bg-gray-700 p-4 text-white"
      >
        {cameraOff ? (
          <VideoOff />
        ) : (
          <Video />
        )}
      </button>

      <button
        onClick={onEnd}
        className="rounded-full bg-red-600 p-4 text-white"
      >
        <PhoneOff />
      </button>

    </div>
  );
}
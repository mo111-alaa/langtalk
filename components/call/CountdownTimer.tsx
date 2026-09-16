"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  onComplete: () => void;
}

export default function CountdownTimer({
  onComplete,
}: CountdownTimerProps) {
  const { formatted } =
    useCountdown(
      7 * 60,
      onComplete
    );

  return (
    <div className="fixed right-6 top-6 z-50 rounded-full bg-black/80 px-5 py-3 font-mono text-xl font-bold text-white">
      {formatted}
    </div>
  );
}
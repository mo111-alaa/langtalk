"use client";

import { useEffect, useState } from "react";

export function useCountdown(
  initialSeconds: number,
  onComplete?: () => void
) {
  const [seconds, setSeconds] =
    useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer =
      setInterval(() => {
        setSeconds(
          (current) =>
            current - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [seconds, onComplete]);

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  return {
    seconds,
    formatted:
      `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`,
  };
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  credits: number;
  onPaywall: () => void;
}

export function StartPracticeButton({
  credits,
  onPaywall,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function start() {
    if (credits <= 0) {
      onPaywall();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === "NO_CREDITS") {
          onPaywall();
          return;
        }

        throw new Error(result.error);
      }

      router.push(`/match/${result.roomId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="mt-10 rounded-2xl bg-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading
        ? "Finding a partner..."
        : "Start 7-Min Practice Session"}
    </button>
  );
}
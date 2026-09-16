"use client";

import { useState } from "react";

interface IcebreakerPanelProps {
  prompts: string[];
}

export default function IcebreakerPanel({
  prompts,
}: IcebreakerPanelProps) {
  const [index, setIndex] =
    useState(0);

  if (prompts.length === 0) {
    return null;
  }

  const nextPrompt = () => {
    setIndex(
      (current) =>
        (current + 1) %
        prompts.length
    );
  };

  return (
    <div className="absolute left-6 top-6 max-w-sm rounded-2xl bg-white/95 p-5 shadow-xl dark:bg-gray-900/95">

      <p className="text-sm font-medium text-gray-500">
        Icebreaker
      </p>

      <p className="mt-2 text-lg font-semibold dark:text-white">
        {prompts[index]}
      </p>

      <button
        onClick={nextPrompt}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Next
      </button>

    </div>
  );
}
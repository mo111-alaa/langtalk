"use client";

interface FreeCreditsBadgeProps {
  credits: number;
}

export default function FreeCreditsBadge({
  credits,
}: FreeCreditsBadgeProps) {
  return (
    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      Free calls: {credits}
    </div>
  );
}
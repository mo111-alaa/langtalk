"use client";

import { useState } from "react";

interface FeedbackModalProps {
  onSubmit: (
    rating: number,
    reportPartner: boolean
  ) => void;
}

export default function FeedbackModal({
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] =
    useState(0);

  const [reportPartner, setReportPartner] =
    useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">

        <h2 className="text-2xl font-bold dark:text-white">
          How was your session?
        </h2>

        <div className="mt-6 flex justify-center gap-2">

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                onClick={() =>
                  setRating(star)
                }
                className={`text-4xl ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                ★
              </button>
            )
          )}

        </div>

        <label className="mt-6 flex gap-3 dark:text-white">

          <input
            type="checkbox"
            checked={reportPartner}
            onChange={(event) =>
              setReportPartner(
                event.target.checked
              )
            }
          />

          Report this partner

        </label>

        <button
          disabled={rating === 0}
          onClick={() =>
            onSubmit(
              rating,
              reportPartner
            )
          }
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-50"
        >
          Submit feedback
        </button>

      </div>

    </div>
  );
}
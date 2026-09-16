"use client";

import { useState } from "react";

import type {
  LanguageCode,
  ProficiencyLevel,
} from "@/types/profile";

import {
  LANGUAGES,
  PROFICIENCY_LEVELS,
} from "@/lib/constants";

import {
  useLocalization,
} from "@/components/ui/LocalizationProvider";

import { createClient } from "@/lib/supabase/client";

interface OnboardingModalProps {
  initialNativeLanguage?: LanguageCode | null;

  onComplete?: (data: {
    nativeLanguage: LanguageCode;
    country: string;
    targetLanguage: LanguageCode;
    proficiency: ProficiencyLevel;
  }) => void;
}

const COUNTRIES = [
  "Egypt",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Jordan",
  "Morocco",
  "Tunisia",
  "Turkey",
  "India",
  "Indonesia",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "Russia",
] as const;

export default function OnboardingModal({
  initialNativeLanguage = null,
  onComplete,
}: OnboardingModalProps) {
  const { t, setLanguage } =
    useLocalization();

  const [step, setStep] = useState(1);

  const [nativeLanguage, setNativeLanguage] =
    useState<LanguageCode | null>(
      initialNativeLanguage
    );

  const [country, setCountry] =
    useState("");

  const [targetLanguage, setTargetLanguage] =
    useState<LanguageCode | null>(null);

  const [proficiency, setProficiency] =
    useState<ProficiencyLevel | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  function selectNativeLanguage(
    language: LanguageCode
  ) {
    setNativeLanguage(language);
    setLanguage(language);
  }

  function nextStep() {
    if (step < 3) {
      setStep(step + 1);
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function finish() {
    if (
      !nativeLanguage ||
      !country ||
      !targetLanguage ||
      !proficiency
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: {
          user,
        },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "You must be logged in first."
        );
        return;
      }

      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            native_language:
              nativeLanguage,

            country,

            target_language:
              targetLanguage,

            level:
              proficiency,

            onboarding_completed:
              true,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      onComplete?.({
        nativeLanguage,
        country,
        targetLanguage,
        proficiency,
      });
    } catch (err) {
      console.error(
        "Failed to save onboarding:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const canContinue =
    step === 1
      ? nativeLanguage !== null
      : step === 2
        ? country !== ""
        : targetLanguage !== null &&
          proficiency !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome")}
            </h2>

            <span className="text-sm text-gray-500">
              {step} / 3
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${(step / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              {t("nativeLanguage")}
            </h3>

            <p className="mb-5 text-sm text-gray-500">
              Choose one of the supported languages.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(
                (language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() =>
                      selectNativeLanguage(
                        language.code
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      nativeLanguage ===
                      language.code
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:text-white"
                    }`}
                  >
                    {language.label}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              {t("country")}
            </h3>

            <p className="mb-5 text-sm text-gray-500">
              This helps us determine regional pricing.
            </p>

            <select
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">
                Select your country
              </option>

              {COUNTRIES.map(
                (countryName) => (
                  <option
                    key={countryName}
                    value={countryName}
                  >
                    {countryName}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              {t("targetLanguage")}
            </h3>

            <div className="mb-6 grid grid-cols-2 gap-3">
              {LANGUAGES.map(
                (language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() =>
                      setTargetLanguage(
                        language.code
                      )
                    }
                    className={`rounded-xl border p-3 text-left transition ${
                      targetLanguage ===
                      language.code
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:text-white"
                    }`}
                  >
                    {language.label}
                  </button>
                )
              )}
            </div>

            <h4 className="mb-3 font-medium dark:text-white">
              {t("proficiency")}
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {PROFICIENCY_LEVELS.map(
                (level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      setProficiency(
                        level.value
                      )
                    }
                    className={`rounded-xl border p-3 text-sm ${
                      proficiency ===
                      level.value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 dark:border-gray-700 dark:text-white"
                    }`}
                  >
                    {t(level.value)}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={previousStep}
            disabled={
              step === 1 || saving
            }
            className="rounded-xl px-5 py-3 text-gray-600 disabled:invisible dark:text-gray-300"
          >
            {t("back")}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {t("continue")}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={
                !canContinue || saving
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : t("finish")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
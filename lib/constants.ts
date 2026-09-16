import type { LanguageCode } from "@/types/profile";

export const LANGUAGES: {
  code: LanguageCode;
  label: string;
}[] = [
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
];

export const PROFICIENCY_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
] as const;

export const CALL_DURATION_SECONDS = 7 * 60;

export const EGYPT_PRICING = [
  {
    id: "eg-basic",
    name: "50 Practice Sessions",
    credits: 50,
    amount: 99,
    currency: "EGP" as const,
  },
  {
    id: "eg-standard",
    name: "200 Practice Sessions",
    credits: 200,
    amount: 344,
    currency: "EGP" as const,
  },
];

export const GLOBAL_PRICING = [
  {
    id: "global-basic",
    name: "50 Practice Sessions",
    credits: 50,
    amount: 20.99,
    currency: "USD" as const,
  },
  {
    id: "global-standard",
    name: "200 Practice Sessions",
    credits: 200,
    amount: 59.99,
    currency: "USD" as const,
  },
];
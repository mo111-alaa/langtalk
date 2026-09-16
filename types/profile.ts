export const SUPPORTED_LANGUAGES = [
  "ar",
  "en",
  "es",
  "de",
  "fr",
  "ja",
  "ko",
  "ru",
  "tr",
] as const;

export type LanguageCode =
  (typeof SUPPORTED_LANGUAGES)[number];

export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export interface UserProfile {
  id: string;

  native_language: LanguageCode | null;

  target_language: LanguageCode | null;

  proficiency: ProficiencyLevel | null;

  country: string | null;

  free_calls_remaining: number;

  onboarding_completed: boolean;

  created_at: string;

  updated_at: string;
}
import type { LanguageCode } from "@/types/profile";

export const RTL_LANGUAGES: LanguageCode[] = ["ar"];

export function isRTL(language: LanguageCode) {
  return RTL_LANGUAGES.includes(language);
}
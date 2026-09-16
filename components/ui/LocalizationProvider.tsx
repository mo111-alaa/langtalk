"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { LanguageCode } from "@/types/profile";

import { translations } from "@/lib/i18n/translations";

type LocalizationContextType = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  direction: "rtl" | "ltr";
  t: (key: string) => string;
};

const LocalizationContext =
  createContext<
    LocalizationContextType | undefined
  >(undefined);

export function LocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] =
    useState<LanguageCode>("en");

  // تحديد اتجاه الصفحة حسب اللغة
  const direction: "rtl" | "ltr" =
    language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang =
      language;

    document.documentElement.dir =
      direction;
  }, [language, direction]);

  const t = (key: string): string => {
    const langTranslations =
      translations[language] as Record<
        string,
        string
      >;

    return (
      langTranslations?.[key] || key
    );
  };

  return (
    <LocalizationContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context =
    useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }

  return context;
}
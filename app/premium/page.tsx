"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  CreditCard,
  Wallet,
} from "lucide-react";

import type { LanguageCode } from "@/types/profile";
import { translations } from "@/lib/i18n/translations";
import { createClient } from "@/lib/supabase/client";

type Plan = "monthly" | "yearly";

type ProfileData = {
  native_language: LanguageCode | null;
  country: string | null;
  subscription_status: string | null;
  subscription_plan: Plan | null;
  subscription_expires_at: string | null;
};

type CountryPricing = {
  currency: string;
  symbol: string;
  monthly: number;
  yearly: number;
  wallets: boolean;
};

const defaultPricing: CountryPricing = {
  currency: "USD",
  symbol: "$",
  monthly: 6.99,
  yearly: 49.99,
  wallets: false,
};

const countryPricing: Record<string, CountryPricing> = {
  Egypt: {
    currency: "EGP",
    symbol: "ج.م",
    monthly: 100,
    yearly: 1000,
    wallets: true,
  },

  "United States": {
    currency: "USD",
    symbol: "$",
    monthly: 6.99,
    yearly: 49.99,
    wallets: false,
  },

  Canada: {
    currency: "CAD",
    symbol: "C$",
    monthly: 9.49,
    yearly: 69.99,
    wallets: false,
  },

  "United Kingdom": {
    currency: "GBP",
    symbol: "£",
    monthly: 5.99,
    yearly: 44.99,
    wallets: false,
  },

  Germany: {
    currency: "EUR",
    symbol: "€",
    monthly: 6.99,
    yearly: 49.99,
    wallets: false,
  },

  France: {
    currency: "EUR",
    symbol: "€",
    monthly: 6.99,
    yearly: 49.99,
    wallets: false,
  },

  Spain: {
    currency: "EUR",
    symbol: "€",
    monthly: 5.99,
    yearly: 44.99,
    wallets: false,
  },

  Italy: {
    currency: "EUR",
    symbol: "€",
    monthly: 5.99,
    yearly: 44.99,
    wallets: false,
  },

  Netherlands: {
    currency: "EUR",
    symbol: "€",
    monthly: 6.99,
    yearly: 49.99,
    wallets: false,
  },

  UAE: {
    currency: "AED",
    symbol: "AED",
    monthly: 24.99,
    yearly: 179.99,
    wallets: false,
  },

  "Saudi Arabia": {
    currency: "SAR",
    symbol: "SAR",
    monthly: 24.99,
    yearly: 179.99,
    wallets: false,
  },

  Qatar: {
    currency: "QAR",
    symbol: "QAR",
    monthly: 24.99,
    yearly: 179.99,
    wallets: false,
  },

  Kuwait: {
    currency: "KWD",
    symbol: "KWD",
    monthly: 2.49,
    yearly: 17.99,
    wallets: false,
  },

  Jordan: {
    currency: "JOD",
    symbol: "JOD",
    monthly: 4.99,
    yearly: 34.99,
    wallets: false,
  },

  Morocco: {
    currency: "MAD",
    symbol: "MAD",
    monthly: 59.99,
    yearly: 399.99,
    wallets: false,
  },

  Tunisia: {
    currency: "TND",
    symbol: "TND",
    monthly: 14.99,
    yearly: 99.99,
    wallets: false,
  },

  Turkey: {
    currency: "TRY",
    symbol: "₺",
    monthly: 199.99,
    yearly: 1299.99,
    wallets: false,
  },

  India: {
    currency: "INR",
    symbol: "₹",
    monthly: 399,
    yearly: 2999,
    wallets: false,
  },

  Indonesia: {
    currency: "IDR",
    symbol: "Rp",
    monthly: 69000,
    yearly: 449000,
    wallets: false,
  },

  Brazil: {
    currency: "BRL",
    symbol: "R$",
    monthly: 29.9,
    yearly: 199.9,
    wallets: false,
  },

  Mexico: {
    currency: "MXN",
    symbol: "MX$",
    monthly: 129,
    yearly: 799,
    wallets: false,
  },

  Japan: {
    currency: "JPY",
    symbol: "¥",
    monthly: 990,
    yearly: 6900,
    wallets: false,
  },

  "South Korea": {
    currency: "KRW",
    symbol: "₩",
    monthly: 9900,
    yearly: 69000,
    wallets: false,
  },

  Russia: {
    currency: "RUB",
    symbol: "₽",
    monthly: 499,
    yearly: 3499,
    wallets: false,
  },
};

export default function PremiumPage() {
  const supabase = createClient();

  const [plan, setPlan] =
    useState<Plan>("yearly");

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } =
          await supabase
            .from("profiles")
            .select(
              `
                native_language,
                country,
                subscription_status,
                subscription_plan,
                subscription_expires_at
              `
            )
            .eq("id", user.id)
            .single();

        if (error) {
          console.error(
            "Premium profile error:",
            error
          );

          setLoading(false);
          return;
        }

        setProfile(
          data as ProfileData
        );
      } catch (error) {
        console.error(
          "Premium loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const language: LanguageCode =
    profile?.native_language ?? "en";

  const t = translations[language];

  const isRTL =
    language === "ar";

  const country =
    profile?.country?.trim() || "";

  const pricing =
    countryPricing[country] ??
    defaultPricing;

  const selectedPrice =
    plan === "monthly"
      ? pricing.monthly
      : pricing.yearly;

  const selectedSymbol =
    pricing.symbol;

  const isActive =
    profile?.subscription_status ===
    "active";

  function formatPrice(
    value: number
  ) {
    return new Intl.NumberFormat(
      language === "ar"
        ? "ar"
        : language,
      {
        maximumFractionDigits: 2,
      }
    ).format(value);
  }

  async function handlePayment() {
    try {
      setPaymentLoading(true);

      const response =
        await fetch("/payment", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            plan,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Payment initialization failed."
        );
      }

      if (!data.clientSecret) {
        throw new Error(
          "Paymob did not return a client secret."
        );
      }

      const publicKey =
        process.env
          .NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          "Paymob public key is missing."
        );
      }

      /*
       * Open Paymob Unified Checkout.
       */
      window.location.href =
        `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
          publicKey
        )}&clientSecret=${encodeURIComponent(
          data.clientSecret
        )}`;
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Payment failed."
      );

      setPaymentLoading(false);
    }
  }

  if (loading) {
    return (
      <main
        dir={
          isRTL
            ? "rtl"
            : "ltr"
        }
        className="flex min-h-screen items-center justify-center bg-neutral-950 text-white"
      >
        <div className="text-neutral-400">
          ...
        </div>
      </main>
    );
  }

  return (
    <main
      dir={
        isRTL
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen bg-neutral-950 px-4 py-10 text-white"
    >
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
            <Crown size={30} />
          </div>

          <h1 className="text-4xl font-bold">
            {t.premiumTitle}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            {t.premiumDescription}
          </p>

          {isActive && (
            <div className="mx-auto mt-5 inline-flex rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm">
              {t.activeSubscription}
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="mx-auto mb-8 grid max-w-2xl gap-4 md:grid-cols-2">

          {/* Monthly */}
          <button
            type="button"
            onClick={() =>
              setPlan("monthly")
            }
            className={`rounded-2xl border p-6 text-start transition ${
              plan === "monthly"
                ? "border-white bg-white text-black"
                : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
            }`}
          >
            <div className="mb-2 text-sm opacity-70">
              {t.monthly}
            </div>

            <div className="text-3xl font-bold">
              {formatPrice(
                pricing.monthly
              )}

              <span className="ms-2 text-base font-normal">
                {selectedSymbol} /{" "}
                {t.month}
              </span>
            </div>
          </button>

          {/* Yearly */}
          <button
            type="button"
            onClick={() =>
              setPlan("yearly")
            }
            className={`relative rounded-2xl border p-6 text-start transition ${
              plan === "yearly"
                ? "border-white bg-white text-black"
                : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
            }`}
          >
            <span
              className={`absolute -top-3 ${
                isRTL
                  ? "right-5"
                  : "left-5"
              } rounded-full bg-white px-3 py-1 text-xs font-bold text-black`}
            >
              {t.yearly}
            </span>

            <div className="mb-2 text-sm opacity-70">
              {t.yearly}
            </div>

            <div className="text-3xl font-bold">
              {formatPrice(
                pricing.yearly
              )}

              <span className="ms-2 text-base font-normal">
                {selectedSymbol} /{" "}
                {t.year}
              </span>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

          <h2 className="mb-5 text-xl font-bold">
            {t.premium}
          </h2>

          <div className="space-y-4">

            {[
              t.startPractice,
              t.freeCalls,
              t.icebreakers,
              t.feedback,
              t.premiumDescription,
            ].map(
              (
                feature,
                index
              ) => (
                <div
                  key={`${feature}-${index}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black">
                    <Check size={15} />
                  </div>

                  <span className="text-neutral-200">
                    {feature}
                  </span>
                </div>
              )
            )}

          </div>
        </div>

        {/* Payment */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

          <div className="mb-5">

            <p className="text-sm text-neutral-400">
              {t.choosePlan}
            </p>

            <div className="mt-1 text-2xl font-bold">
              {formatPrice(
                selectedPrice
              )}{" "}
              {selectedSymbol}
            </div>

            <p className="text-sm text-neutral-400">
              {plan === "monthly"
                ? t.monthly
                : t.yearly}
            </p>

          </div>

          {/* Payment methods */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2">

            <div className="flex items-center gap-3 rounded-xl border border-neutral-700 p-4">
              <CreditCard size={22} />

              <div>
                <div className="font-semibold">
                  {t.cards}
                </div>

                <div className="text-xs text-neutral-400">
                  {t.paymentMethods}
                </div>
              </div>
            </div>

            {pricing.wallets && (
              <div className="flex items-center gap-3 rounded-xl border border-neutral-700 p-4">
                <Wallet size={22} />

                <div>
                  <div className="font-semibold">
                    {t.wallets}
                  </div>

                  <div className="text-xs text-neutral-400">
                    {t.paymentMethods}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Subscribe */}
          <button
            type="button"
            disabled={
              paymentLoading
            }
            onClick={
              handlePayment
            }
            className="w-full rounded-xl bg-white py-4 font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paymentLoading
              ? "..."
              : `${t.subscribe} — ${formatPrice(
                  selectedPrice
                )} ${selectedSymbol}`}
          </button>

          <p className="mt-4 text-center text-xs text-neutral-500">
            {t.paymentMethods}
          </p>

        </div>

      </div>
    </main>
  );
}
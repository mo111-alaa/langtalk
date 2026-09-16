import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAYMOB_INTENTION_URL =
  "https://accept.paymob.com/v1/intention/";

const PRICING: Record<
  string,
  {
    currency: string;
    monthly: number;
    yearly: number;
  }
> = {
  Egypt: {
    currency: "EGP",
    monthly: 100,
    yearly: 1000,
  },

  "United States": {
    currency: "USD",
    monthly: 6.99,
    yearly: 49.99,
  },

  Canada: {
    currency: "CAD",
    monthly: 9.49,
    yearly: 69.99,
  },

  "United Kingdom": {
    currency: "GBP",
    monthly: 5.99,
    yearly: 44.99,
  },

  Germany: {
    currency: "EUR",
    monthly: 6.99,
    yearly: 49.99,
  },

  France: {
    currency: "EUR",
    monthly: 6.99,
    yearly: 49.99,
  },

  Spain: {
    currency: "EUR",
    monthly: 5.99,
    yearly: 44.99,
  },

  Italy: {
    currency: "EUR",
    monthly: 5.99,
    yearly: 44.99,
  },

  Netherlands: {
    currency: "EUR",
    monthly: 6.99,
    yearly: 49.99,
  },

  UAE: {
    currency: "AED",
    monthly: 24.99,
    yearly: 179.99,
  },

  "Saudi Arabia": {
    currency: "SAR",
    monthly: 24.99,
    yearly: 179.99,
  },

  Qatar: {
    currency: "QAR",
    monthly: 24.99,
    yearly: 179.99,
  },

  Kuwait: {
    currency: "KWD",
    monthly: 2.49,
    yearly: 17.99,
  },

  Jordan: {
    currency: "JOD",
    monthly: 4.99,
    yearly: 34.99,
  },

  Morocco: {
    currency: "MAD",
    monthly: 59.99,
    yearly: 399.99,
  },

  Tunisia: {
    currency: "TND",
    monthly: 14.99,
    yearly: 99.99,
  },

  Turkey: {
    currency: "TRY",
    monthly: 199.99,
    yearly: 1299.99,
  },

  India: {
    currency: "INR",
    monthly: 399,
    yearly: 2999,
  },

  Indonesia: {
    currency: "IDR",
    monthly: 69000,
    yearly: 449000,
  },

  Brazil: {
    currency: "BRL",
    monthly: 29.9,
    yearly: 199.9,
  },

  Mexico: {
    currency: "MXN",
    monthly: 129,
    yearly: 799,
  },

  Japan: {
    currency: "JPY",
    monthly: 990,
    yearly: 6900,
  },

  "South Korea": {
    currency: "KRW",
    monthly: 9900,
    yearly: 69000,
  },

  Russia: {
    currency: "RUB",
    monthly: 499,
    yearly: 3499,
  },
};

const DEFAULT_PRICING = {
  currency: "USD",
  monthly: 6.99,
  yearly: 49.99,
};

function getAmountInMinorUnits(
  amount: number,
  currency: string
) {
  const zeroDecimalCurrencies =
    new Set([
      "JPY",
      "KRW",
    ]);

  if (
    zeroDecimalCurrencies.has(
      currency
    )
  ) {
    return Math.round(amount);
  }

  return Math.round(
    amount * 100
  );
}

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const requestedPlan =
      body?.plan;

    if (
      requestedPlan !==
        "monthly" &&
      requestedPlan !==
        "yearly"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid plan.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          `
            native_language,
            country
          `
        )
        .eq(
          "id",
          user.id
        )
        .single();

    if (
      profileError ||
      !profile
    ) {
      console.error(
        "Profile error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Profile not found.",

          details:
            profileError?.details ||
            null,

          hint:
            profileError?.hint ||
            null,

          code:
            profileError?.code ||
            null,
        },
        {
          status: 404,
        }
      );
    }

    const country =
      profile.country
        ?.trim() || "";

    const pricing =
      PRICING[country] ??
      DEFAULT_PRICING;

    const amount =
      requestedPlan ===
      "monthly"
        ? pricing.monthly
        : pricing.yearly;

    const currency =
      pricing.currency;

    const amountMinor =
      getAmountInMinorUnits(
        amount,
        currency
      );

    /*
     * Create pending subscription
     */
    const {
      data: subscription,
      error:
        subscriptionError,
    } =
      await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan: requestedPlan,
          status: "pending",
          amount,
          currency,
        })
        .select("id")
        .single();

    if (
      subscriptionError ||
      !subscription
    ) {
      console.error(
        "Subscription insert error:",
        subscriptionError
      );

      return NextResponse.json(
        {
          error:
            subscriptionError?.message ||
            "Could not create subscription.",

          details:
            subscriptionError?.details ||
            null,

          hint:
            subscriptionError?.hint ||
            null,

          code:
            subscriptionError?.code ||
            null,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Paymob environment variables
     */
    const secretKey =
      process.env
        .PAYMOB_SECRET_KEY;

    const integrationId =
      process.env
        .PAYMOB_CARD_INTEGRATION_ID;

    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL;

    if (
      !secretKey ||
      !integrationId ||
      !appUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Paymob environment variables are missing.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Create Paymob Intention
     */
    const intentionResponse =
      await fetch(
        PAYMOB_INTENTION_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Token ${secretKey}`,
          },

          body: JSON.stringify({
            amount:
              amountMinor,

            currency,

            payment_methods: [
              Number(
                integrationId
              ),
            ],

            special_reference:
              subscription.id,

           notification_url:
  `${appUrl}/payment/webhook`,

            redirection_url:
              `${appUrl}/premium?payment=return`,

            billing_data: {
              apartment:
                "NA",

              email:
                user.email ??
                "customer@example.com",

              floor:
                "NA",

              first_name:
                user.user_metadata
                  ?.first_name ??
                "LangTalk",

              last_name:
                user.user_metadata
                  ?.last_name ??
                "User",

              phone_number:
                user.phone ??
                "01000000000",

              shipping_method:
                "NA",

              postal_code:
                "NA",

              city:
                country ||
                "NA",

              state:
                "NA",

              country:
                country ||
                "EG",

              street:
                "NA",
            },
          }),
        }
      );

    const intention =
      await intentionResponse.json();

    if (
      !intentionResponse.ok
    ) {
      console.error(
        "Paymob intention error:",
        intention
      );

      return NextResponse.json(
        {
          error:
            "Could not create Paymob payment.",

          details:
            intention,
        },
        {
          status: 502,
        }
      );
    }

    /*
     * Save Paymob information
     */
    const {
      error:
        updateError,
    } =
      await supabase
        .from("subscriptions")
        .update({
          payment_provider:
            "paymob",

          payment_id:
            intention.id
              ? String(
                  intention.id
                )
              : null,

          order_id:
            intention.intention_order_id
              ? String(
                  intention.intention_order_id
                )
              : null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          subscription.id
        );

    if (updateError) {
      console.error(
        "Subscription update error:",
        updateError
      );
    }

    /*
     * Return checkout data
     */
    return NextResponse.json({
      success: true,

      subscriptionId:
        subscription.id,

      clientSecret:
        intention.client_secret ??
        null,

      intentionId:
        intention.id ??
        null,

      orderId:
        intention.intention_order_id ??
        null,
    });
  } catch (error) {
    console.error(
      "Payment route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected payment error.",
      },
      {
        status: 500,
      }
    );
  }
}
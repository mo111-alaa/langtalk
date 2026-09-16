import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

type PaymobCallback = {
  type?: string;
  hmac?: string;

  obj?: {
    id?: number;
    pending?: boolean;
    amount_cents?: number;
    success?: boolean;
    is_auth?: boolean;
    is_capture?: boolean;
    is_standalone_payment?: boolean;
    is_voided?: boolean;
    is_refunded?: boolean;
    is_3d_secure?: boolean;
    integration_id?: number;
    created_at?: string;
    currency?: string;
    error_occured?: boolean;
    has_parent_transaction?: boolean;
    order?: {
      id?: number;
    };
    owner?: number;
    source_data?: {
      pan?: string;
      type?: string;
      sub_type?: string;
    };
  };
};

function calculatePaymobHmac(transaction: NonNullable<PaymobCallback["obj"]>) {
  const secret = process.env.PAYMOB_HMAC_SECRET;

  if (!secret) {
    throw new Error("PAYMOB_HMAC_SECRET is not configured.");
  }

  /*
   * Paymob transaction HMAC fields.
   * Values are concatenated in the documented order
   * and hashed using HMAC-SHA512.
   */
  const values = [
    transaction.amount_cents,
    transaction.created_at,
    transaction.currency,
    transaction.error_occured,
    transaction.has_parent_transaction,
    transaction.id,
    transaction.integration_id,
    transaction.is_3d_secure,
    transaction.is_auth,
    transaction.is_capture,
    transaction.is_refunded,
    transaction.is_standalone_payment,
    transaction.is_voided,
    transaction.order?.id,
    transaction.owner,
    transaction.pending,
    transaction.source_data?.pan,
    transaction.source_data?.sub_type,
    transaction.source_data?.type,
    transaction.success,
  ];

  const concatenated = values
    .map((value) => String(value ?? ""))
    .join("");

  return crypto
    .createHmac("sha512", secret)
    .update(concatenated)
    .digest("hex");
}

export async function POST(request: Request) {
  console.log("🔥 PAYMOB WEBHOOK RECEIVED");

  try {
    const body = (await request.json()) as PaymobCallback;

    console.log(
      "Paymob webhook received:",
      JSON.stringify(body)
    );

    const transaction = body?.obj;

    if (!transaction) {
      return NextResponse.json(
        {
          error: "Invalid Paymob callback.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Verify Paymob HMAC before trusting
     * the transaction data.
     */
    const receivedHmac =
      new URL(request.url).searchParams.get("hmac");

    if (!receivedHmac) {
      console.error(
        "Paymob HMAC is missing."
      );

      return NextResponse.json(
        {
          error: "Missing Paymob HMAC.",
        },
        {
          status: 401,
        }
      );
    }

    const calculatedHmac =
      calculatePaymobHmac(transaction);

    const receivedBuffer =
      Buffer.from(receivedHmac, "utf8");

    const calculatedBuffer =
      Buffer.from(calculatedHmac, "utf8");

    const hmacValid =
      receivedBuffer.length ===
        calculatedBuffer.length &&
      crypto.timingSafeEqual(
        receivedBuffer,
        calculatedBuffer
      );

    if (!hmacValid) {
      console.error(
        "Invalid Paymob HMAC."
      );

      return NextResponse.json(
        {
          error: "Invalid Paymob HMAC.",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      "✅ Paymob HMAC verified successfully."
    );

    /*
     * Ignore unsuccessful, pending,
     * refunded or voided transactions.
     */
    if (
      transaction.success !== true ||
      transaction.pending === true ||
      transaction.is_refunded === true ||
      transaction.is_voided === true
    ) {
      console.log(
        "Paymob transaction was not successful."
      );

      return NextResponse.json({
        received: true,
        success: false,
      });
    }

    const paymobOrderId =
      transaction.order?.id;

    const transactionId =
      transaction.id;

    if (!paymobOrderId) {
      console.error(
        "Paymob order ID is missing."
      );

      return NextResponse.json(
        {
          error:
            "Paymob order ID is missing.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Paymob is an external server.
     * Therefore we MUST NOT use the
     * normal authenticated Supabase client.
     */
    const supabase =
      createAdminClient();

    /*
     * Find the pending subscription
     * using Paymob's order ID.
     */
    const {
      data: subscription,
      error: subscriptionError,
    } =
      await supabase
        .from("subscriptions")
        .select(
          `
            id,
            user_id,
            plan,
            status,
            amount,
            currency
          `
        )
        .eq(
          "order_id",
          String(paymobOrderId)
        )
        .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Subscription lookup error:",
        subscriptionError
      );

      return NextResponse.json(
        {
          error:
            "Could not find subscription.",
        },
        {
          status: 500,
        }
      );
    }

    if (!subscription) {
      console.error(
        "Subscription not found for Paymob order:",
        paymobOrderId
      );

      return NextResponse.json(
        {
          error:
            "Subscription not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Idempotency:
     * Don't activate the same subscription twice.
     */
    if (
      subscription.status === "active"
    ) {
      console.log(
        "Subscription already active:",
        subscription.id
      );

      return NextResponse.json({
        received: true,
        alreadyProcessed: true,
      });
    }

    /*
     * Calculate subscription dates.
     */
    const startedAt = new Date();

    const expiresAt =
      new Date(startedAt);

    if (
      subscription.plan === "monthly"
    ) {
      expiresAt.setMonth(
        expiresAt.getMonth() + 1
      );
    } else {
      expiresAt.setFullYear(
        expiresAt.getFullYear() + 1
      );
    }

    /*
     * Activate subscription.
     */
    const {
      error: updateSubscriptionError,
    } =
      await supabase
        .from("subscriptions")
        .update({
          status: "active",

          payment_id:
            transactionId
              ? String(transactionId)
              : null,

          started_at:
            startedAt.toISOString(),

          expires_at:
            expiresAt.toISOString(),

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          subscription.id
        );

    if (
      updateSubscriptionError
    ) {
      console.error(
        "Subscription activation error:",
        updateSubscriptionError
      );

      return NextResponse.json(
        {
          error:
            "Could not activate subscription.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Update user's profile.
     */
    const {
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .update({
          subscription_status:
            "active",

          subscription_plan:
            subscription.plan,

          subscription_expires_at:
            expiresAt.toISOString(),

          subscription_updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          subscription.user_id
        );

    if (profileError) {
      console.error(
        "Profile subscription update error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Subscription activated but profile update failed.",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "Subscription successfully activated:",
      subscription.id
    );

    return NextResponse.json({
      received: true,
      success: true,
      subscriptionId:
        subscription.id,
      expiresAt:
        expiresAt.toISOString(),
    });
  } catch (error) {
    console.error(
      "Paymob webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected webhook error.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * Health check.
 */
export async function GET() {
  return NextResponse.json(
    {
      message:
        "Paymob webhook endpoint is active.",
    },
    {
      status: 200,
    }
  );
}
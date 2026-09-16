import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request
) {
  const requestUrl = new URL(request.url);

  const code =
    requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=missing_code",
        requestUrl.origin
      )
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code
    );

  if (error) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=auth_failed",
        requestUrl.origin
      )
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/auth/login",
        requestUrl.origin
      )
    );
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !profile.onboarding_completed
  ) {
    return NextResponse.redirect(
      new URL(
        "/onboarding",
        requestUrl.origin
      )
    );
  }

  return NextResponse.redirect(
    new URL(
      "/dashboard",
      requestUrl.origin
    )
  );
}
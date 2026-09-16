import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  getLaunchStatus,
} from "@/lib/launch";

import Dashboard from "@/components/dashboard/Dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select(
      "free_calls_remaining, onboarding_completed, native_language, target_language, level, country"
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/auth/login");
  }

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <Dashboard
      email={user.email ?? ""}
      country={profile.country ?? ""}
      credits={profile.free_calls_remaining ?? 0}
      nativeLanguage={profile.native_language ?? ""}
      targetLanguage={profile.target_language ?? ""}
      level={profile.level ?? ""}
      launchStatus={getLaunchStatus()}
    />
  );
}
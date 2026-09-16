"use client";

import { useRouter } from "next/navigation";

import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <OnboardingModal
      onComplete={() => {
        router.push("/dashboard");
        router.refresh();
      }}
    />
  );
}
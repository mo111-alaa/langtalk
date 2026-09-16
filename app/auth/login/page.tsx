"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loginWithEmail() {
    console.log("LOGIN BUTTON CLICKED");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Starting Supabase login...");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      console.log("Supabase response:", {
        data,
        error,
      });

      if (error) {
        console.error(
          "Supabase login error:",
          error
        );

        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        console.error(
          "Login succeeded but no session was created."
        );

        setError(
          "Login succeeded but no session was created."
        );

        setLoading(false);
        return;
      }

      console.log("LOGIN SUCCESS");

      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Unexpected login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    console.log("GOOGLE BUTTON CLICKED");

    setLoading(true);
    setError("");

    try {
      console.log("Starting Google OAuth...");

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        console.error(
          "Google OAuth error:",
          error
        );

        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "Unexpected Google OAuth error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not connect to Google."
      );

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            LWA
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Welcome back
          </p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          {loading
            ? "Please wait..."
            : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

          <span className="text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Your password"
            autoComplete="current-password"
            disabled={loading}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loginWithEmail();
              }
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Email Login */}
        <button
          type="button"
          onClick={loginWithEmail}
          disabled={
            loading ||
            !email.trim() ||
            !password
          }
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : "Sign in"}
        </button>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>

      </div>
    </main>
  );
}
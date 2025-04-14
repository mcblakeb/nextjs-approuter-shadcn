"use client";

import { SuperRetroLogo } from "@/components/ui/retro-logo";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Your large logo */}
        <div className="flex justify-center">
          <SuperRetroLogo
            size="lg"
            primaryColor="#3f4b1c"
            className="w-full max-w-[280px] font-bangers"
          />
        </div>

        {/* Login card */}
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-semibold">Sign In</h1>
          <div className="space-y-4">
            <button
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/retro/onboarding",
                  redirect: true,
                })
              }
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

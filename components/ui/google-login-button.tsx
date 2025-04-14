// components/ui/google-login-button.tsx
"use client";

import { Button } from "./button";
import { Google } from "@/components/ui/google-icon";
import { signIn } from "next-auth/react";

export function GoogleLoginButton() {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => signIn("google")}
      className="w-full"
    >
      <Google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}

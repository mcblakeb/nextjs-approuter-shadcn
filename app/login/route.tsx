import { GoogleLoginButton } from "@/components/ui/google-login-button";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>
        <div className="space-y-4">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

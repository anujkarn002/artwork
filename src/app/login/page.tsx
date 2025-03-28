import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | Artwork",
  description: "Login to your Artwork account",
};

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-md">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

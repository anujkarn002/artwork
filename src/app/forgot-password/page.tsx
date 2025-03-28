import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot Password | Artwork",
  description: "Reset your Artwork password",
};

export default async function ForgotPasswordPage() {
  // Check if user is already logged in and redirect if they are
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

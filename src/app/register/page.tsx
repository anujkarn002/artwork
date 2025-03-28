import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register | Artwork",
  description: "Create a new Artwork account",
};

export default async function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}

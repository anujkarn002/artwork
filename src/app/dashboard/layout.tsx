import { ReactNode } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import UserNav from "@/components/dashboard/user-nav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createServerSupabaseClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null; // This shouldn't happen because middleware should catch it
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // Check if user has an artisan profile
  const { data: artisanProfile } = await supabase
    .from("artisan_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const isArtisan = profile?.role === "artisan";
  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4 md:gap-8">
            <a href="/" className="hidden items-center space-x-2 md:flex">
              <span className="hidden font-bold sm:inline-block">Artwork</span>
            </a>
          </div>
          <UserNav user={session.user} profile={profile} />
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:gap-10">
        <DashboardSidebar
          isArtisan={isArtisan}
          isAdmin={isAdmin}
          artisanVerified={artisanProfile?.verification_status === "verified"}
        />
        <main className="flex flex-col w-full py-6">{children}</main>
      </div>
    </div>
  );
}

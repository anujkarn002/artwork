import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ArtisanProfileForm from "@/components/dashboard/artisan-profile-form";

export const metadata: Metadata = {
  title: "Artisan Profile | Artwork",
  description: "Manage your artisan profile on Artwork",
};

export default async function ArtisanProfilePage() {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/artisan-profile");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get artisan profile if it exists
  const { data: artisanProfile } = await supabase
    .from("artisan_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get crafts for the form
  const { data: crafts } = await supabase
    .from("crafts")
    .select("id, name")
    .order("name");

  const isArtisan = profile?.role === "artisan";
  const isProfileComplete = !!artisanProfile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Artisan Profile</h1>
        <p className="text-muted-foreground mt-2">
          {isArtisan
            ? isProfileComplete
              ? "Manage your artisan details and showcase your craft"
              : "Complete your artisan profile to start selling your crafts"
            : "Become an artisan and start selling your handmade crafts"}
        </p>
      </div>

      {isProfileComplete &&
        artisanProfile.verification_status !== "verified" && (
          <div
            className={`p-4 rounded-md ${
              artisanProfile.verification_status === "pending"
                ? "bg-amber-50 text-amber-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <h3 className="font-medium">
              {artisanProfile.verification_status === "pending"
                ? "Verification Pending"
                : "Verification Rejected"}
            </h3>
            <p className="text-sm mt-1">
              {artisanProfile.verification_status === "pending"
                ? "Your artisan profile is under review. You will be notified once it is verified."
                : "Your verification was rejected. Please update your profile and reapply."}
            </p>
          </div>
        )}

      <ArtisanProfileForm
        userProfile={profile}
        artisanProfile={artisanProfile}
        crafts={crafts || []}
      />
    </div>
  );
}

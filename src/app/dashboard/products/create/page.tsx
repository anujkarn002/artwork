import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ProductForm from "@/components/dashboard/product-form";

export const metadata: Metadata = {
  title: "Add Product | Artwork",
  description: "Add a new product to Artwork",
};

export default async function CreateProductPage() {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/products/create");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Check if user is an artisan
  if (profile?.role !== "artisan") {
    redirect("/dashboard");
  }

  // Check if artisan is verified
  const { data: artisanProfile } = await supabase
    .from("artisan_profiles")
    .select("verification_status, craft_id")
    .eq("id", user.id)
    .single();

  if (artisanProfile?.verification_status !== "verified") {
    redirect("/dashboard/products");
  }

  // Get craft categories for the form
  const { data: crafts } = await supabase
    .from("crafts")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new product listing for your handcrafted items
        </p>
      </div>

      <ProductForm
        crafts={crafts || []}
        defaultCraftId={artisanProfile?.craft_id || undefined}
      />
    </div>
  );
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { PackageIcon, PlusIcon } from "lucide-react";
import ProductsDataTable from "@/components/dashboard/products-data-table";

export const metadata: Metadata = {
  title: "Manage Products | Artwork",
  description: "Manage your products on Artwork",
};

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/products");
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
    .select("verification_status")
    .eq("id", user.id)
    .single();

  if (artisanProfile?.verification_status !== "verified") {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        </div>

        <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-md">
          <h3 className="font-medium">Verification Required</h3>
          <p className="text-sm mt-1">
            Your artisan profile needs to be verified before you can add
            products. Please complete your profile and wait for verification.
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/artisan-profile">
              Complete Artisan Profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get artisan's products
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      craft:crafts(id, name)
    `
    )
    .eq("artisan_id", user.id)
    .order("created_at", { ascending: false });

  // If no products, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <Button asChild>
            <Link href="/dashboard/products/create">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <EmptyState
          icon={<PackageIcon className="h-8 w-8 text-muted-foreground" />}
          title="No products yet"
          description="You haven't added any products yet. Add your first product to start selling on Artwork."
          actionLabel="Add Product"
          actionHref="/dashboard/products/create"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/create">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsDataTable products={products} />
    </div>
  );
}

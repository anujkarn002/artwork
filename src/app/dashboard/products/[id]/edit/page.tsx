import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import ProductForm from "@/components/dashboard/product-form";

export const metadata: Metadata = {
  title: "Edit Product | Artwork",
  description: "Edit your product on Artwork",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Get the product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  // Check if product exists and belongs to the artisan
  if (!product) {
    notFound();
  }

  if (product.artisan_id !== user.id) {
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update your product details and information
        </p>
      </div>

      <ProductForm crafts={crafts || []} product={product} isEditing />
    </div>
  );
}

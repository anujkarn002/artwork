import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get a specific product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Validate the UUID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Get the product with all related data
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        craft:crafts(*),
        artisan:artisan_profiles(
          *,
          profiles:profiles(id, full_name, avatar_url, location)
        ),
        reviews:reviews(
          *,
          customer:profiles(id, full_name, avatar_url)
        )
      `
      )
      .eq("id", params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Record not found
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      throw error;
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("Error fetching product:", error);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Update a product - Only the artisan who created it or an admin
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Get the product to check ownership
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, artisan_id")
      .eq("id", params.id)
      .single();

    if (productError) {
      if (productError.code === "PGRST116") {
        // Record not found
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      throw productError;
    }

    // Get user role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Check if user is authorized to update this product
    if (profile.role !== "admin" && product.artisan_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "Forbidden - You do not have permission to update this product",
        },
        { status: 403 }
      );
    }

    // Validate the request body
    const productUpdateSchema = z.object({
      craft_id: z.string().uuid().optional(),
      name: z.string().min(2).max(100).optional(),
      description: z.string().min(10).optional(),
      price: z.number().positive().optional(),
      discount_price: z.number().positive().optional().nullable(),
      materials: z.array(z.string()).optional().nullable(),
      dimensions: z.string().optional().nullable(),
      weight: z.string().optional().nullable(),
      image_urls: z
        .array(z.string())
        .min(1, "At least one image is required")
        .optional(),
      is_available: z.boolean().optional(),
      is_featured: z.boolean().optional(),
      stock_quantity: z.number().int().min(0).optional(),
      creation_time: z.string().optional().nullable(),
    });

    const body = await request.json();
    const validatedData = productUpdateSchema.parse(body);

    // Update the product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(validatedData)
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Delete a product - Only the artisan who created it or an admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Get the product to check ownership
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, artisan_id")
      .eq("id", params.id)
      .single();

    if (productError) {
      if (productError.code === "PGRST116") {
        // Record not found
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      throw productError;
    }

    // Get user role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Check if user is authorized to delete this product
    if (profile.role !== "admin" && product.artisan_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "Forbidden - You do not have permission to delete this product",
        },
        { status: 403 }
      );
    }

    // Delete the product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

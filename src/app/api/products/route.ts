import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for product query parameters
const productQuerySchema = z.object({
  craft: z.string().uuid().optional(),
  artisan: z.string().uuid().optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .optional(),
  available: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Parse query parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const validatedParams = productQuerySchema.parse(params);

    // Start building the query
    let query = supabase.from("products").select(`
        *,
        craft:crafts(id, name),
        artisan:artisan_profiles(
          id,
          profiles:profiles(id, full_name, avatar_url)
        )
      `);

    // Apply filters
    if (validatedParams.craft) {
      query = query.eq("craft_id", validatedParams.craft);
    }

    if (validatedParams.artisan) {
      query = query.eq("artisan_id", validatedParams.artisan);
    }

    if (validatedParams.minPrice) {
      query = query.gte("price", parseFloat(validatedParams.minPrice));
    }

    if (validatedParams.maxPrice) {
      query = query.lte("price", parseFloat(validatedParams.maxPrice));
    }

    if (validatedParams.available) {
      query = query.eq("is_available", validatedParams.available === "true");
    }

    if (validatedParams.featured) {
      query = query.eq("is_featured", validatedParams.featured === "true");
    }

    if (validatedParams.search) {
      query = query.or(
        `name.ilike.%${validatedParams.search}%,description.ilike.%${validatedParams.search}%`
      );
    }

    // Apply sorting
    if (validatedParams.sort) {
      switch (validatedParams.sort) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
      }
    } else {
      // Default sort by newest
      query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    const limit = validatedParams.limit ? parseInt(validatedParams.limit) : 12;
    const offset = validatedParams.offset
      ? parseInt(validatedParams.offset)
      : 0;

    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      products: data,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Creating a new product - Artisan only
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and is an artisan
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is an artisan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "artisan") {
      return NextResponse.json(
        { error: "Forbidden - Artisan access required" },
        { status: 403 }
      );
    }

    // Verify artisan profile exists and is verified
    const { data: artisanProfile, error: artisanError } = await supabase
      .from("artisan_profiles")
      .select("id, verification_status")
      .eq("id", user.id)
      .single();

    if (artisanError || !artisanProfile) {
      return NextResponse.json(
        { error: "Artisan profile not found" },
        { status: 404 }
      );
    }

    if (artisanProfile.verification_status !== "verified") {
      return NextResponse.json(
        {
          error:
            "Your artisan profile must be verified before listing products",
        },
        { status: 403 }
      );
    }

    // Validate the request body
    const productSchema = z.object({
      craft_id: z.string().uuid(),
      name: z.string().min(2).max(100),
      description: z.string().min(10),
      price: z.number().positive(),
      discount_price: z.number().positive().optional(),
      materials: z.array(z.string()).optional(),
      dimensions: z.string().optional(),
      weight: z.string().optional(),
      image_urls: z.array(z.string()).min(1, "At least one image is required"),
      stock_quantity: z.number().int().min(0).default(1),
      creation_time: z.string().optional(),
    });

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Create the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        ...validatedData,
        artisan_id: user.id,
      })
      .select()
      .single();

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

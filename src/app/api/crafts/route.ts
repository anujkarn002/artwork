import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for craft query parameters
const craftQuerySchema = z.object({
  category: z.string().uuid().optional(),
  region: z.string().uuid().optional(),
  isGiTagged: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Parse query parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const validatedParams = craftQuerySchema.parse(params);

    // Start building the query
    let query = supabase.from("crafts").select(`
        *,
        category:craft_categories(id, name),
        region:regions(id, name, state)
      `);

    // Apply filters
    if (validatedParams.category) {
      query = query.eq("category_id", validatedParams.category);
    }

    if (validatedParams.region) {
      query = query.eq("region_id", validatedParams.region);
    }

    if (validatedParams.isGiTagged) {
      query = query.eq("is_gi_tagged", validatedParams.isGiTagged === "true");
    }

    if (validatedParams.featured) {
      query = query.eq("featured", validatedParams.featured === "true");
    }

    if (validatedParams.search) {
      query = query.or(
        `name.ilike.%${validatedParams.search}%,description.ilike.%${validatedParams.search}%`
      );
    }

    // Apply pagination
    const limit = validatedParams.limit ? parseInt(validatedParams.limit) : 10;
    const offset = validatedParams.offset
      ? parseInt(validatedParams.offset)
      : 0;

    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from("crafts")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      crafts: data,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching crafts:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to fetch crafts" },
      { status: 500 }
    );
  }
}

// Creating a new craft - Admin only
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and is an admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Validate the request body
    const craftSchema = z.object({
      name: z.string().min(2).max(100),
      description: z.string().min(10),
      category_id: z.string().uuid().optional(),
      region_id: z.string().uuid().optional(),
      is_gi_tagged: z.boolean().default(false),
      gi_tag_year: z.string().optional(),
      historical_context: z.string().optional(),
      materials: z.array(z.string()).optional(),
      techniques: z.array(z.string()).optional(),
      cultural_significance: z.string().optional(),
      featured: z.boolean().default(false),
      image_url: z.string().optional(),
    });

    const body = await request.json();
    const validatedData = craftSchema.parse(body);

    // Create the craft
    const { data: craft, error: craftError } = await supabase
      .from("crafts")
      .insert(validatedData)
      .select()
      .single();

    if (craftError) {
      return NextResponse.json({ error: craftError.message }, { status: 500 });
    }

    return NextResponse.json({ craft }, { status: 201 });
  } catch (error) {
    console.error("Error creating craft:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create craft" },
      { status: 500 }
    );
  }
}

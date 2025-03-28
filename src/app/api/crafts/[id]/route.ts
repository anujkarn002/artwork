import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get a specific craft by ID
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

    // Get the craft with all related data
    const { data, error } = await supabase
      .from("crafts")
      .select(
        `
        *,
        category:craft_categories(id, name),
        region:regions(id, name, state)
      `
      )
      .eq("id", params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Record not found
        return NextResponse.json({ error: "Craft not found" }, { status: 404 });
      }

      throw error;
    }

    return NextResponse.json({ craft: data });
  } catch (error) {
    console.error("Error fetching craft:", error);

    return NextResponse.json(
      { error: "Failed to fetch craft" },
      { status: 500 }
    );
  }
}

// Update a craft - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate the ID
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Validate the request body
    const craftUpdateSchema = z.object({
      name: z.string().min(2).max(100).optional(),
      description: z.string().min(10).optional(),
      category_id: z.string().uuid().optional().nullable(),
      region_id: z.string().uuid().optional().nullable(),
      is_gi_tagged: z.boolean().optional(),
      gi_tag_year: z.string().optional().nullable(),
      historical_context: z.string().optional().nullable(),
      materials: z.array(z.string()).optional().nullable(),
      techniques: z.array(z.string()).optional().nullable(),
      cultural_significance: z.string().optional().nullable(),
      featured: z.boolean().optional(),
      image_url: z.string().optional().nullable(),
    });

    const body = await request.json();
    const validatedData = craftUpdateSchema.parse(body);

    // Check if the craft exists
    const { data: existingCraft, error: existingError } = await supabase
      .from("crafts")
      .select("id")
      .eq("id", params.id)
      .single();

    if (existingError) {
      if (existingError.code === "PGRST116") {
        // Record not found
        return NextResponse.json({ error: "Craft not found" }, { status: 404 });
      }

      throw existingError;
    }

    // Update the craft
    const { data: craft, error: craftError } = await supabase
      .from("crafts")
      .update(validatedData)
      .eq("id", params.id)
      .select()
      .single();

    if (craftError) {
      return NextResponse.json({ error: craftError.message }, { status: 500 });
    }

    return NextResponse.json({ craft });
  } catch (error) {
    console.error("Error updating craft:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update craft" },
      { status: 500 }
    );
  }
}

// Delete a craft - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate the ID
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Check if the craft exists
    const { data: existingCraft, error: existingError } = await supabase
      .from("crafts")
      .select("id")
      .eq("id", params.id)
      .single();

    if (existingError) {
      if (existingError.code === "PGRST116") {
        // Record not found
        return NextResponse.json({ error: "Craft not found" }, { status: 404 });
      }

      throw existingError;
    }

    // Delete the craft
    const { error: deleteError } = await supabase
      .from("crafts")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting craft:", error);

    return NextResponse.json(
      { error: "Failed to delete craft" },
      { status: 500 }
    );
  }
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating artisan profile update requests
const artisanProfileSchema = z.object({
  craft_id: z.string().uuid().optional(),
  experience_years: z.number().int().min(0).optional(),
  awards: z
    .array(
      z.object({
        name: z.string(),
        year: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        year: z.string(),
        certificate_url: z.string().optional(),
      })
    )
    .optional(),
  story: z.string().max(2000).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has an artisan profile
    const { data: existingProfile } = await supabase
      .from("artisan_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Artisan profile does not exist. Use POST to create." },
        { status: 404 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = artisanProfileSchema.parse(body);

    // Update the artisan profile
    const { data, error } = await supabase
      .from("artisan_profiles")
      .update(validatedData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ artisanProfile: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's artisan profile
  const { data: artisanProfile, error: profileError } = await supabase
    .from("artisan_profiles")
    .select(
      `
      *,
      profiles:profiles(full_name, avatar_url),
      crafts:crafts(id, name)
    `
    )
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    // Not found is ok
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ artisanProfile });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = artisanProfileSchema.parse(body);

    // Check if user already has an artisan profile
    const { data: existingProfile } = await supabase
      .from("artisan_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "Artisan profile already exists. Use PUT to update." },
        { status: 400 }
      );
    }

    // First, update the user role to artisan
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: "artisan" })
      .eq("id", user.id);

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 500 });
    }

    // Create the artisan profile
    const { data, error } = await supabase
      .from("artisan_profiles")
      .insert({
        id: user.id,
        ...validatedData,
        verification_status: "pending",
      })
      .select()
      .single();

    if (error) {
      // Rollback the role change if profile creation fails
      await supabase
        .from("profiles")
        .update({ role: "customer" })
        .eq("id", user.id);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ artisanProfile: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

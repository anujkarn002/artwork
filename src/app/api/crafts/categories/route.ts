import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all craft categories
    const { data, error } = await supabase
      .from("craft_categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json({ categories: data });
  } catch (error) {
    console.error("Error fetching craft categories:", error);

    return NextResponse.json(
      { error: "Failed to fetch craft categories" },
      { status: 500 }
    );
  }
}

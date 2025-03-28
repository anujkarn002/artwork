import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all regions
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json({ regions: data });
  } catch (error) {
    console.error("Error fetching regions:", error);

    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 }
    );
  }
}

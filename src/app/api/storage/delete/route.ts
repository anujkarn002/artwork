import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
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

    // Validate the request body
    const deleteSchema = z.object({
      bucket: z.enum(["avatars", "products", "crafts", "documents"]),
      path: z.string(),
    });

    const body = await request.json();
    const { bucket, path } = deleteSchema.parse(body);

    // Security check: ensure the file belongs to the user
    // Files should be prefixed with the user's ID for this to work
    if (!path.startsWith(`${user.id}-`)) {
      // Allow admins to delete any file
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        return NextResponse.json(
          { error: "You do not have permission to delete this file" },
          { status: 403 }
        );
      }
    }

    // Delete the file
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

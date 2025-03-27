import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const region = searchParams.get("region");

  let query = supabase.from("crafts").select("*");

  if (id) {
    query = query.eq("id", id);
  }

  if (region) {
    query = query.eq("region", region);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  // First, check if the user is authenticated and authorized
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("crafts")
      .insert([
        {
          name: body.name,
          description: body.description,
          region: body.region,
          is_gi_tagged: body.isGiTagged || false,
          historical_context: body.historicalContext || null,
          techniques: body.techniques || null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

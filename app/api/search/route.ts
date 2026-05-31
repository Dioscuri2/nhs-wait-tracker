import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { POSTCODE_TO_REGION } from "@/lib/supabase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function postcodeToRegion(postcode: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    const data = await res.json();
    if (data.status !== 200 || !data.result) return null;
    const region = data.result.region as string;
    return POSTCODE_TO_REGION[region] ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get("postcode")?.trim();
  const specialty = searchParams.get("specialty")?.trim();

  if (!postcode || !specialty) {
    return NextResponse.json({ error: "postcode and specialty are required" }, { status: 400 });
  }

  const region = await postcodeToRegion(postcode);
  if (!region) {
    return NextResponse.json({ error: "Could not find NHS region for that postcode. Please check and try again." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("wait_times")
    .select("*")
    .eq("specialty", specialty)
    .eq("region", region)
    .not("treatment_avg", "is", null)
    .order("treatment_avg", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Database error. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ results: data, region });
}

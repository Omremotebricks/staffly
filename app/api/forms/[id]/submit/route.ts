import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "../../../../lib/supabase";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

async function getUser(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) return null;

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    if (decoded.type !== "access") return null;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    return user;
  } catch (e) {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Validate form exists and is published
  const { data: form } = await supabase
    .from("forms")
    .select("status")
    .eq("id", id)
    .single();

  if (!form || form.status !== "published") {
    return NextResponse.json({ error: "Form not available" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("form_submissions")
    .insert({
      form_id: id,
      user_id: user.id,
      data: body.data,
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

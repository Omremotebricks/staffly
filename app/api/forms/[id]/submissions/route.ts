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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check if form exists
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("id, title")
    .eq("id", id)
    .single();
  if (formError || !form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  let query = supabase
    .from("form_submissions")
    .select(
      `
      *,
      user:user_id (name, email, employee_code, department)
    `
    )
    .eq("form_id", id)
    .order("submitted_at", { ascending: false });

  // Role Logic:
  // Admin: See all
  // HR (Manager): See all (per requirement "managers can view and manage assigned submissions", assuming HR is manager for now)
  // Employee: See ONLY their own submissions

  if (user.role === "employee") {
    query = query.eq("user_id", user.id);
  }
  // If we had more complex manager assignment logic, it would go here.
  // For now, allow 'hr' and 'admin' to see all for the form.

  if (user.role !== "admin" && user.role !== "hr" && user.role !== "employee") {
    // Unknown role, default to own submissions just in case
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

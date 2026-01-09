import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "../../lib/supabase";
import { Form } from "../../types/forms";

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

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admins see all forms, others see published forms
  let query = supabase
    .from("forms")
    .select("*")
    .order("created_at", { ascending: false });

  if (user.role !== "admin") {
    // Start building the query with the status filter
    query = query.eq("status", "published");

    // Note: Assignments logic would go here. For now, show all published.
    // If we had specific assignments:
    // query = query.or(`assignments.cs.{"${user.id}"},assignments.cs.{"${user.role}"}`)
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getUser(request);

  // Check if user has permission to create forms
  if (!user || (user.role !== "admin" && !user.can_create_forms)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newForm: Partial<Form> = {
      ...body,
      created_by: user.id,
      // Non-admins can only create drafts
      status: user.role === "admin" ? body.status || "draft" : "draft",
      fields: body.fields || [],
      settings: body.settings || {},
    };

    const { data, error } = await supabase
      .from("forms")
      .insert(newForm)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

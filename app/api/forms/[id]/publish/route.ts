import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/app/lib/supabase";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: formId } = await params;
  console.log("PATCH request received for form id:", formId);
  try {
    const user = await getUser(request);
    console.log("Current user:", user?.email, "Role:", user?.role);

    // Only admins can publish/unpublish forms
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Only administrators can publish forms" },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    console.log("Requested status change to:", status);

    // Validate status
    if (!["draft", "published", "archived", "disabled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // If publishing, ensure there's at least one field
    if (status === "published") {
      const { data: formCheck, error: checkError } = await supabase
        .from("forms")
        .select("fields")
        .eq("id", formId)
        .single();

      if (checkError) throw checkError;
      if (!formCheck.fields || formCheck.fields.length === 0) {
        return NextResponse.json(
          { error: "Cannot publish an empty form. Please add fields first." },
          { status: 400 }
        );
      }
    }

    // Update form status
    const { data, error } = await supabase
      .from("forms")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", formId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating form status:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Successfully updated form status to:", status);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Catch error updating form status:", error);
    return NextResponse.json(
      { error: `Internal error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

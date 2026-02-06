import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../../lib/data";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET ||
  "your-super-secret-refresh-key-change-in-production";
const CSRF_SECRET =
  process.env.CSRF_SECRET || "your-super-secret-csrf-key-change-in-production";

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Generate CSRF token
function generateCSRFToken(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const payload = `${timestamp}.${randomBytes}`;

  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");

  return `${payload}.${signature}`;
}

// Verify CSRF token
function verifyCSRFToken(token: string): boolean {
  try {
    const [timestamp, randomBytes, signature] = token.split(".");
    const payload = `${timestamp}.${randomBytes}`;

    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );

    const tokenAge = Date.now() - parseInt(timestamp);
    const isNotExpired = tokenAge < 60 * 60 * 1000; // 1 hour

    return isValidSignature && isNotExpired;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, csrfToken } = await request.json();

    // Verify CSRF token
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }

    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: "refresh",
        tokenId: crypto.randomUUID(),
      },
      REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        employeeCode: user.employeeCode,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        hodEmail: user.hodEmail,
        isActive: user.isActive,
      },
    });

    // Set httpOnly cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Session hint for client-side AuthProvider initialization
    response.cookies.set("staffly_session_hint", "true", {
      httpOnly: false, // Must be accessible to client JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // Match refresh token
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Get CSRF token endpoint
export async function GET() {
  const csrfToken = generateCSRFToken();

  const response = NextResponse.json({ csrfToken });

  response.cookies.set("csrfToken", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return response;
}

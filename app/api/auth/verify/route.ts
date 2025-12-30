import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { isValid: false, error: 'No access token' },
        { status: 401 }
      );
    }

    // Verify access token
    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    
    if (decoded.type !== 'access') {
      return NextResponse.json(
        { isValid: false, error: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Get full user data from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !userData) {
      return NextResponse.json(
        { isValid: false, error: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isValid: true,
      user: {
        id: userData.id,
        employeeCode: userData.employee_code,
        name: userData.name,
        email: userData.email,
        department: userData.department,
        role: userData.role,
        hodEmail: userData.hod_email,
        isActive: userData.is_active
      }
    });
  } catch (error) {
    return NextResponse.json(
      { isValid: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}
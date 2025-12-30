import { NextRequest, NextResponse } from 'next/server';
import { createLeaveRequest, getLeaveRequests, updateLeaveRequestStatus } from '../../lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRequest = await createLeaveRequest(body);
    
    if (!newRequest) {
      return NextResponse.json(
        { success: false, message: 'Failed to create leave request' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to HR/Admin
    // await sendEmailNotification(newRequest);

    return NextResponse.json({ 
      success: true, 
      message: 'Leave request submitted successfully',
      request: newRequest 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit leave request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeCode = searchParams.get('employeeCode');
    
    const requests = await getLeaveRequests(employeeCode || undefined);
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leave requests' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, approvedBy, rejectionReason } = await request.json();
    
    const success = await updateLeaveRequestStatus(id, status, approvedBy, rejectionReason);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Leave request not found' },
        { status: 404 }
      );
    }

    // TODO: Send email notification to employee
    // await sendStatusUpdateEmail(request);

    return NextResponse.json({ 
      success: true, 
      message: `Leave request ${status} successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update leave request' },
      { status: 500 }
    );
  }
}

// TODO: Implement email notification functions
// async function sendEmailNotification(request: LeaveRequest) {
//   // Send email to HR/Admin about new leave request
// }

// async function sendStatusUpdateEmail(request: LeaveRequest) {
//   // Send email to employee about status update
// }
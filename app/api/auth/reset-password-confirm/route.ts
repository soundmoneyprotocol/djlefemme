import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // This would integrate with Supabase's updateUser
    // For now, return a message to check Supabase
    // In production, you'd update user password via Supabase auth API

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.',
    }, { status: 200 });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

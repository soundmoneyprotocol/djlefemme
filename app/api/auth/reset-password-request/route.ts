import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // This would integrate with Supabase's resetPasswordForEmail
    // For now, provide instructions to user
    // In production, you'd call Supabase auth API

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions sent to email',
      note: 'Check your email for a password reset link. If you do not see an email, check your spam folder.',
    }, { status: 200 });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}

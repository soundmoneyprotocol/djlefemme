export const dynamic = 'force-dynamic';

// In production, use environment variables and proper hashing
const ADMIN_PASSWORD = process.env.DASHBOARD_PASSWORD || 'tasha2024';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return Response.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    // Verify password
    if (password === ADMIN_PASSWORD) {
      // In production, generate a proper JWT token
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');

      return Response.json({
        success: true,
        token: token,
        message: 'Login successful',
      });
    } else {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

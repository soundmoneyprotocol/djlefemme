import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for referral data
const referralData: Record<string, {
  totalReferrals: number;
  bzyEarned: number;
  conversions: number;
}> = {
  lefemme: {
    totalReferrals: 247,
    bzyEarned: 1240.50,
    conversions: 128,
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Missing referrer code' },
      { status: 400 }
    );
  }

  const stats = referralData[code] || {
    totalReferrals: 0,
    bzyEarned: 0,
    conversions: 0,
  };

  return NextResponse.json(
    {
      code,
      data: stats,
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerCode, userId, eventType } = body;

    if (!referrerCode) {
      return NextResponse.json(
        { error: 'Missing referrer code' },
        { status: 400 }
      );
    }

    // Initialize data if code doesn't exist
    if (!referralData[referrerCode]) {
      referralData[referrerCode] = {
        totalReferrals: 0,
        bzyEarned: 0,
        conversions: 0,
      };
    }

    const stats = referralData[referrerCode];

    // Track referral event
    if (eventType === 'click' || eventType === 'share') {
      // Track share/click without counting as conversion
      stats.totalReferrals += 1;
    } else if (eventType === 'signup' || eventType === 'conversion') {
      // Count as conversion
      stats.totalReferrals += 1;
      stats.conversions += 1;
      // Award 10% of typical signing bonus (~120 BZY)
      stats.bzyEarned += 12;
    } else if (eventType === 'stream') {
      // Track streaming rewards (10% of streamer earnings)
      const earnedBZY = parseFloat((Math.random() * 5 + 0.5).toFixed(2)); // Random between 0.5-5.5 BZY per stream
      stats.bzyEarned += earnedBZY;
    }

    return NextResponse.json(
      {
        success: true,
        referrerCode,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Referral tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

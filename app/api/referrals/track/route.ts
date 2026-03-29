export const dynamic = 'force-dynamic';

// In-memory storage for referrals (in production, use a real database)
let referralsData: {
  [key: string]: {
    totalReferrals: number;
    bzyEarned: number;
    conversions: number;
    lastUpdated: string;
  };
} = {
  lefemme: {
    totalReferrals: 247,
    bzyEarned: 1240,
    conversions: 128,
    lastUpdated: new Date().toISOString(),
  },
};

export async function POST(request: Request) {
  try {
    const { referrerCode, userId, eventType } = await request.json();

    if (!referrerCode) {
      return Response.json(
        { error: 'Missing referrer code' },
        { status: 400 }
      );
    }

    // Initialize referral data if not exists
    if (!referralsData[referrerCode]) {
      referralsData[referrerCode] = {
        totalReferrals: 0,
        bzyEarned: 0,
        conversions: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Track the event
    const referralRecord = referralsData[referrerCode];

    switch (eventType) {
      case 'click':
        referralRecord.totalReferrals += 1;
        break;
      case 'conversion':
        referralRecord.conversions += 1;
        referralRecord.bzyEarned += Math.random() * 10; // Simulate earning
        break;
      case 'earning':
        referralRecord.bzyEarned += parseFloat(request.headers.get('x-amount') || '0');
        break;
    }

    referralRecord.lastUpdated = new Date().toISOString();

    return Response.json({
      success: true,
      data: referralRecord,
    });
  } catch (error) {
    console.error('Referral tracking error:', error);
    return Response.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referrerCode = searchParams.get('code');

    if (!referrerCode) {
      return Response.json(
        { error: 'Missing referrer code' },
        { status: 400 }
      );
    }

    const data = referralsData[referrerCode] || {
      totalReferrals: 0,
      bzyEarned: 0,
      conversions: 0,
      lastUpdated: new Date().toISOString(),
    };

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for earnings data
let earningsData: Array<{
  trackTitle: string;
  playCount: number;
  totalEarnings: number;
  lastPlayed: string;
  playHistory: Array<{
    timestamp: string;
    duration: number;
    earnings: number;
  }>;
}> = [
  {
    trackTitle: 'Bestie - LeFemme',
    playCount: 0,
    totalEarnings: 0,
    lastPlayed: '',
    playHistory: [],
  },
  {
    trackTitle: 'BadBoy | StickgonBang feat LeFemme',
    playCount: 0,
    totalEarnings: 0,
    lastPlayed: '',
    playHistory: [],
  },
];

export async function GET() {
  // Calculate totals
  const totalPlays = earningsData.reduce((sum, track) => sum + track.playCount, 0);
  const totalEarnings = earningsData.reduce((sum, track) => sum + track.totalEarnings, 0);

  return NextResponse.json({
    tracks: earningsData,
    summary: {
      totalPlays,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      averageEarningsPerPlay: totalPlays > 0 ? parseFloat((totalEarnings / totalPlays).toFixed(4)) : 0,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackTitle, duration, earnings } = body;

    if (!trackTitle || duration === undefined || earnings === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: trackTitle, duration, earnings' },
        { status: 400 }
      );
    }

    // Find or create track entry
    let trackEntry = earningsData.find(t => t.trackTitle === trackTitle);

    if (!trackEntry) {
      trackEntry = {
        trackTitle,
        playCount: 0,
        totalEarnings: 0,
        lastPlayed: new Date().toISOString(),
        playHistory: [],
      };
      earningsData.push(trackEntry);
    }

    // Update stats
    trackEntry.playCount += 1;
    trackEntry.totalEarnings += earnings;
    trackEntry.lastPlayed = new Date().toISOString();

    // Add to history
    trackEntry.playHistory.push({
      timestamp: new Date().toISOString(),
      duration,
      earnings: parseFloat(earnings.toFixed(4)),
    });

    return NextResponse.json(
      {
        success: true,
        trackTitle,
        playCount: trackEntry.playCount,
        totalEarnings: parseFloat(trackEntry.totalEarnings.toFixed(2)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Earnings tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track earnings' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory storage for visitor analytics
let visitorSessions: Array<{
  sessionId: string;
  pageUrl: string;
  timestamps: {
    pageViewAt: string;
    firstPlayAt?: string;
    lastUpdateAt: string;
  };
  videoStreams: Array<{
    videoTitle: string;
    playedAt: string;
    pausedAt?: string;
    duration: number; // seconds
    pausePoints: Array<{
      pausedAt: number; // seconds into video
      timestamp: string;
    }>;
  }>;
  totalPageViewTime: number; // seconds
  totalStreamTime: number; // seconds
}> = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    // Return specific session analytics
    const session = visitorSessions.find(s => s.sessionId === sessionId);
    return NextResponse.json({ session }, { status: 200 });
  }

  // Return all visitor analytics
  return NextResponse.json({
    totalVisitors: visitorSessions.length,
    sessions: visitorSessions
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      event, // 'pageview' | 'play' | 'pause' | 'ended'
      videoTitle,
      videoCurrentTime,
      pageUrl
    } = body;

    if (!sessionId || !event) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, event' },
        { status: 400 }
      );
    }

    // Find or create session
    let session = visitorSessions.find(s => s.sessionId === sessionId);
    const now = new Date().toISOString();

    if (!session) {
      // New visitor session
      session = {
        sessionId,
        pageUrl: pageUrl || '',
        timestamps: {
          pageViewAt: now,
          lastUpdateAt: now,
        },
        videoStreams: [],
        totalPageViewTime: 0,
        totalStreamTime: 0,
      };
      visitorSessions.push(session);
    }

    session.timestamps.lastUpdateAt = now;

    if (event === 'pageview') {
      // Page view event
      session.pageUrl = pageUrl || session.pageUrl;
    } else if (event === 'play' && videoTitle) {
      // Start playing a video
      const stream = {
        videoTitle,
        playedAt: now,
        duration: 0,
        pausePoints: [] as Array<{ pausedAt: number; timestamp: string }>,
      };
      session.videoStreams.push(stream);

      if (!session.timestamps.firstPlayAt) {
        session.timestamps.firstPlayAt = now;
      }
    } else if (event === 'pause' && videoTitle && videoCurrentTime !== undefined) {
      // Pause event
      const lastStream = session.videoStreams
        .filter(s => s.videoTitle === videoTitle)
        .pop();

      if (lastStream) {
        lastStream.pausePoints.push({
          pausedAt: videoCurrentTime,
          timestamp: now,
        });
        lastStream.duration = videoCurrentTime;
        session.totalStreamTime += videoCurrentTime;
      }
    } else if (event === 'ended' && videoTitle && videoCurrentTime !== undefined) {
      // Video ended
      const lastStream = session.videoStreams
        .filter(s => s.videoTitle === videoTitle)
        .pop();

      if (lastStream) {
        lastStream.pausedAt = now;
        lastStream.duration = videoCurrentTime;
        session.totalStreamTime += videoCurrentTime;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Visitor event tracked',
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}

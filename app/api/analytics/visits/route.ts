import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type TrafficSource = 'direct' | 'dark_social' | 'facebook' | 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'whatsapp' | 'telegram' | 'email' | 'search_google' | 'search_bing' | 'search_other' | 'other';

// In-memory storage for visitor analytics
let visitorSessions: Array<{
  sessionId: string;
  pageUrl: string;
  referrer?: string;
  trafficSource: TrafficSource;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  socialMediaLogins?: {
    facebook?: boolean;
    google?: boolean;
    twitter?: boolean;
    instagram?: boolean;
    tiktok?: boolean;
  };
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
    earningsAccumulated: number; // BZY earned during this stream
    earningsUSD: number; // USD equivalent
    pausePoints: Array<{
      pausedAt: number; // seconds into video
      timestamp: string;
    }>;
  }>;
  totalPageViewTime: number; // seconds
  totalStreamTime: number; // seconds
  totalEarningsAccumulated: number; // Total BZY earned in session
  totalEarningsUSD: number; // Total USD equivalent
}> = [];

// Helper function to extract IP from request
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : realIP || 'unknown';
}

// Helper function to classify traffic source from referrer and user agent
function classifyTrafficSource(referrer?: string, userAgent?: string): TrafficSource {
  const lower = referrer?.toLowerCase() || '';
  const userAgentLower = userAgent?.toLowerCase() || '';

  // Check user agent for messaging apps first (more reliable)
  if (userAgentLower.includes('whatsapp')) return 'whatsapp';
  if (userAgentLower.includes('telegram')) return 'telegram';
  if (userAgentLower.includes('instagram') && !lower.includes('instagram.com')) return 'instagram';
  if (userAgentLower.includes('fban/fbios') || userAgentLower.includes('fban/fbav')) return 'facebook';

  // If no referrer, it's dark social
  if (!referrer) {
    return 'dark_social'; // Missing referrer = dark social or direct
  }

  // Social media platforms from referrer
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('instagram.com/direct')) return 'instagram'; // Instagram DMs
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('linkedin.com')) return 'linkedin';

  // Private messaging apps (detected via referrer headers)
  if (lower.includes('whatsapp')) return 'whatsapp';
  if (lower.includes('telegram')) return 'telegram';
  if (lower.includes('mail') || lower.includes('email')) return 'email';

  // Search engines
  if (lower.includes('google.com') || lower.includes('google.')) return 'search_google';
  if (lower.includes('bing.com')) return 'search_bing';
  if (lower.includes('duckduckgo') || lower.includes('startpage') || lower.includes('ecosia')) {
    return 'search_other';
  }

  return 'other';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    // Return specific session analytics
    const session = visitorSessions.find(s => s.sessionId === sessionId);
    return NextResponse.json({ session }, { status: 200 });
  }

  // Return all visitor analytics with summary
  const summary = {
    totalVisitors: visitorSessions.length,
    totalStreams: visitorSessions.reduce((sum, s) => sum + s.videoStreams.length, 0),
    totalStreamTime: visitorSessions.reduce((sum, s) => sum + s.totalStreamTime, 0),
    totalEarningsAccumulated: visitorSessions.reduce((sum, s) => sum + s.totalEarningsAccumulated, 0),
    totalEarningsUSD: visitorSessions.reduce((sum, s) => sum + s.totalEarningsUSD, 0),
    trafficSources: getTrafficSourceStats(),
    darkSocialStats: getDarkSocialStats(),
    topCountries: getTopCountries(),
    socialMediaStats: getSocialMediaStats(),
    sessions: visitorSessions
  };

  return NextResponse.json(summary, { status: 200 });
}

function getTrafficSourceStats() {
  const stats: Record<TrafficSource, number> = {
    direct: 0,
    dark_social: 0,
    facebook: 0,
    twitter: 0,
    instagram: 0,
    tiktok: 0,
    linkedin: 0,
    whatsapp: 0,
    telegram: 0,
    email: 0,
    search_google: 0,
    search_bing: 0,
    search_other: 0,
    other: 0,
  };

  visitorSessions.forEach(session => {
    stats[session.trafficSource]++;
  });

  return stats;
}

function getDarkSocialStats() {
  const darkSocialSessions = visitorSessions.filter(s => s.trafficSource === 'dark_social');
  const darkSocialEarnings = darkSocialSessions.reduce((sum, s) => sum + s.totalEarningsAccumulated, 0);

  return {
    darkSocialVisitors: darkSocialSessions.length,
    percentageOfTotal: ((darkSocialSessions.length / visitorSessions.length) * 100).toFixed(2) + '%',
    darkSocialEarnings,
    averageEarningsPerVisitor: darkSocialSessions.length > 0
      ? (darkSocialEarnings / darkSocialSessions.length).toFixed(2)
      : '0.00',
  };
}

function getTopCountries() {
  const countries: Record<string, number> = {};
  visitorSessions.forEach(session => {
    const country = session.geolocation?.country || 'Unknown';
    countries[country] = (countries[country] || 0) + 1;
  });
  return Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, visitors: count }));
}

function getSocialMediaStats() {
  let stats = {
    facebook: 0,
    google: 0,
    twitter: 0,
    instagram: 0,
    tiktok: 0,
  };

  visitorSessions.forEach(session => {
    if (session.socialMediaLogins) {
      Object.entries(session.socialMediaLogins).forEach(([key, value]) => {
        if (value) stats[key as keyof typeof stats]++;
      });
    }
  });

  return stats;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      event, // 'pageview' | 'play' | 'pause' | 'ended'
      videoTitle,
      videoCurrentTime,
      pageUrl,
      earnings, // BZY earned
      earningsUSD, // USD equivalent
      geolocation,
      socialMediaLogins,
      referrer,
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
      // New visitor session - capture IP and basic info
      const clientIP = getClientIP(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const trafficSource = classifyTrafficSource(referrer, userAgent);

      session = {
        sessionId,
        pageUrl: pageUrl || '',
        referrer,
        trafficSource,
        ipAddress: clientIP,
        userAgent,
        geolocation: geolocation || undefined,
        socialMediaLogins: socialMediaLogins || undefined,
        timestamps: {
          pageViewAt: now,
          lastUpdateAt: now,
        },
        videoStreams: [],
        totalPageViewTime: 0,
        totalStreamTime: 0,
        totalEarningsAccumulated: 0,
        totalEarningsUSD: 0,
      };
      visitorSessions.push(session);
    } else {
      // Update geolocation and social media info if provided
      if (geolocation) session.geolocation = geolocation;
      if (socialMediaLogins) session.socialMediaLogins = socialMediaLogins;
      if (referrer) session.referrer = referrer;
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
        earningsAccumulated: 0,
        earningsUSD: 0,
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

        // Update earnings if provided
        if (earnings !== undefined) {
          lastStream.earningsAccumulated = earnings;
          session.totalEarningsAccumulated += earnings;
        }
        if (earningsUSD !== undefined) {
          lastStream.earningsUSD = earningsUSD;
          session.totalEarningsUSD += earningsUSD;
        }

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

        // Update earnings if provided
        if (earnings !== undefined) {
          lastStream.earningsAccumulated = earnings;
          session.totalEarningsAccumulated += earnings;
        }
        if (earningsUSD !== undefined) {
          lastStream.earningsUSD = earningsUSD;
          session.totalEarningsUSD += earningsUSD;
        }

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

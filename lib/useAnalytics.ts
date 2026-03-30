import { useEffect, useRef } from 'react';

export const useAnalytics = () => {
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // Generate or retrieve session ID for anonymous visitor
    if (!sessionIdRef.current) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('djlefemme_sessionId') : null;
      if (stored) {
        sessionIdRef.current = stored;
      } else {
        // Generate new session ID
        sessionIdRef.current = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('djlefemme_sessionId', sessionIdRef.current);
        }
      }
    }

    // Track page view
    trackEvent('pageview', {
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  }, []);

  const trackEvent = async (
    event: 'pageview' | 'play' | 'pause' | 'ended',
    data: {
      videoTitle?: string;
      videoCurrentTime?: number;
      pageUrl?: string;
    }
  ) => {
    try {
      await fetch('/api/analytics/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          event,
          ...data,
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  return { sessionId: sessionIdRef.current, trackEvent };
};

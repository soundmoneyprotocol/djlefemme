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

    // Detect referrer and social media information
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    // Detect if traffic came from WhatsApp (by user agent)
    const isWhatsApp = userAgent.includes('WhatsApp');

    // Detect social media logins
    const socialMediaLogins = detectSocialMediaLogins();

    // Get geolocation from IP (would need server-side lookup)
    // This would typically come from a geolocation API

    // Track page view
    trackEvent('pageview', {
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer,
      isWhatsApp,
      socialMediaLogins,
    });
  }, []);

  const trackEvent = async (
    event: 'pageview' | 'play' | 'pause' | 'ended',
    data: {
      videoTitle?: string;
      videoCurrentTime?: number;
      pageUrl?: string;
      earnings?: number; // BZY earned
      earningsUSD?: number; // USD equivalent
      referrer?: string;
      isWhatsApp?: boolean;
      socialMediaLogins?: Record<string, boolean>;
      geolocation?: Record<string, any>;
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

  const detectSocialMediaLogins = (): Record<string, boolean> => {
    const logins: Record<string, boolean> = {
      facebook: false,
      google: false,
      twitter: false,
      instagram: false,
      tiktok: false,
    };

    if (typeof window === 'undefined') return logins;

    // Check for social media cookies (basic detection)
    // Note: This requires user consent under GDPR/privacy laws
    try {
      // Facebook detection
      if ((window as any).fbq !== undefined) logins.facebook = true;

      // Google detection
      if ((window as any).gapi !== undefined) logins.google = true;

      // Twitter detection
      if ((window as any).twttr !== undefined) logins.twitter = true;

      // Check for presence of social media in localStorage or sessionStorage
      const storage = sessionStorage.getItem('socialMediaDetected');
      if (storage) {
        const parsed = JSON.parse(storage);
        Object.assign(logins, parsed);
      }
    } catch (error) {
      console.debug('Could not detect social media logins:', error);
    }

    return logins;
  };

  return { sessionId: sessionIdRef.current, trackEvent };
};

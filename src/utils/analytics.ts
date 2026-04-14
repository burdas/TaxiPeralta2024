/**
 * Analytics utility for tracking page views with GDPR consent
 */

const CONSENT_COOKIE_NAME = 'analytics_consent';
const CONSENT_COOKIE_DAYS = 365;

/**
 * Check if user has given analytics consent
 */
export const hasAnalyticsConsent = (): boolean => {
    if (typeof document === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(c => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
    
    return consentCookie?.split('=')[1] === 'true';
};

/**
 * Set analytics consent cookie
 */
export const setAnalyticsConsent = (consent: boolean): void => {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setDate(expires.getDate() + CONSENT_COOKIE_DAYS);
    
    document.cookie = `${CONSENT_COOKIE_NAME}=${consent}; expires=${expires.toUTCString()}; path=/`;
};

/**
 * Get user's IP address
 */
const getUserIP = async (): Promise<string> => {
    const response = await fetch('/api/ip');
    const data = await response.json();
    return data.ip;
};

/**
 * Track page view (only if user has given consent)
 */
export const trackPageView = async (pagina: string): Promise<void> => {
    if (!hasAnalyticsConsent()) {
        return;
    }

    try {
        const ip = await getUserIP();
        const visita = {
            ip: ip,
            pagina: pagina,
        };

        await fetch('/api/visitas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visita),
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error tracking page view:', error);
        }
    }
};

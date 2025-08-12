/**
 * Analytics Service for tracking page visits and user behavior
 */

class AnalyticsService {
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.currentPage = null;
    }

    /**
     * Generate a unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get device type
     */
    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            return 'mobile';
        } else if (/iPad/i.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Get browser information
     */
    getBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Unknown';
    }

    /**
     * Get operating system
     */
    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    /**
     * Get UTM parameters from URL
     */
    getUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utmSource: urlParams.get('utm_source'),
            utmMedium: urlParams.get('utm_medium'),
            utmCampaign: urlParams.get('utm_campaign'),
            utmTerm: urlParams.get('utm_term'),
            utmContent: urlParams.get('utm_content')
        };
    }

    /**
     * Track page visit
     */
    async trackPageVisit(pageUrl, pageTitle, pageCategory, userId = null) {
        try {
            // Calculate time on previous page
            const timeOnPage = this.currentPage ? Math.floor((Date.now() - this.startTime) / 1000) : null;
            
            // Get referrer
            const referrer = this.currentPage || document.referrer;

            const visitData = {
                pageUrl: pageUrl,
                pageTitle: pageTitle,
                pageCategory: pageCategory,
                userId: userId,
                sessionId: this.sessionId,
                timeOnPage: timeOnPage,
                referrer: referrer,
                deviceType: this.getDeviceType(),
                browser: this.getBrowser(),
                operatingSystem: this.getOperatingSystem(),
                ...this.getUtmParameters()
            };

            const response = await fetch(`${this.baseUrl}/analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Page visit tracked:', result);

            // Update current page and start time
            this.currentPage = pageUrl;
            this.startTime = Date.now();

            return result;
        } catch (error) {
            console.error('Error tracking page visit:', error);
            // Don't throw error to avoid breaking user experience
        }
    }

    /**
     * Track page leave (when user navigates away)
     */
    trackPageLeave() {
        if (this.currentPage) {
            const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
            console.log(`Time spent on ${this.currentPage}: ${timeOnPage} seconds`);
            
            // Send final tracking data
            this.trackPageVisit(
                this.currentPage,
                document.title,
                'page-leave',
                null
            );
        }
    }

    /**
     * Track custom event
     */
    async trackEvent(eventName, eventData = {}) {
        try {
            const eventPayload = {
                eventName: eventName,
                eventData: eventData,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                pageUrl: window.location.href,
                pageTitle: document.title
            };

            const response = await fetch(`${this.baseUrl}/analytics/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Event tracked:', eventName, eventData);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Track form submission
     */
    async trackFormSubmission(formName, formData = {}) {
        await this.trackEvent('form_submission', {
            formName: formName,
            formData: formData
        });
    }

    /**
     * Track button click
     */
    async trackButtonClick(buttonName, buttonLocation) {
        await this.trackEvent('button_click', {
            buttonName: buttonName,
            buttonLocation: buttonLocation
        });
    }

    /**
     * Track link click
     */
    async trackLinkClick(linkUrl, linkText) {
        await this.trackEvent('link_click', {
            linkUrl: linkUrl,
            linkText: linkText
        });
    }

    /**
     * Track scroll depth
     */
    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                // Track at 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(maxScrollDepth)) {
                    this.trackEvent('scroll_depth', {
                        depth: maxScrollDepth,
                        pageUrl: window.location.href
                    });
                }
            }
        });
    }

    /**
     * Initialize analytics tracking
     */
    init() {
        // Track initial page load
        this.trackPageVisit(
            window.location.href,
            document.title,
            'homepage'
        );

        // Track scroll depth
        this.trackScrollDepth();

        // Track page leave
        window.addEventListener('beforeunload', () => {
            this.trackPageLeave();
        });

        // Track visibility change (when user switches tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });

        console.log('Analytics service initialized');
    }

    /**
     * Get analytics summary
     */
    async getAnalyticsSummary() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/summary`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics summary:', error);
            throw error;
        }
    }

    /**
     * Get most visited pages
     */
    async getMostVisitedPages(limit = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/most-visited-pages?limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching most visited pages:', error);
            throw error;
        }
    }

    /**
     * Get daily trends
     */
    async getDailyTrends(days = 7) {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/daily-trends?days=${days}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching daily trends:', error);
            throw error;
        }
    }

    /**
     * Get device distribution
     */
    async getDeviceDistribution() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/device-distribution`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching device distribution:', error);
            throw error;
        }
    }

    /**
     * Get browser distribution
     */
    async getBrowserDistribution() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics/browser-distribution`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching browser distribution:', error);
            throw error;
        }
    }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService; 
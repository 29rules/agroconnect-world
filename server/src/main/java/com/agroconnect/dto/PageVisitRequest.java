package com.agroconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for page visit tracking requests
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
public class PageVisitRequest {

    @NotBlank(message = "Page URL is required")
    private String pageUrl;

    @NotBlank(message = "Page title is required")
    private String pageTitle;

    @NotBlank(message = "Page category is required")
    private String pageCategory;

    private String userId; // Optional - for logged-in users

    @NotBlank(message = "Session ID is required")
    private String sessionId;

    private Long timeOnPage; // Time spent on page in seconds

    private String referrer; // Previous page URL

    private String deviceType; // mobile, desktop, tablet

    private String browser; // Chrome, Firefox, Safari, etc.

    private String operatingSystem; // Windows, macOS, Linux, iOS, Android

    private String utmSource; // UTM parameters for tracking

    private String utmMedium;

    private String utmCampaign;

    private String utmTerm;

    private String utmContent;

    // Constructor
    public PageVisitRequest() {}

    public PageVisitRequest(String pageUrl, String pageTitle, String pageCategory, String sessionId) {
        this.pageUrl = pageUrl;
        this.pageTitle = pageTitle;
        this.pageCategory = pageCategory;
        this.sessionId = sessionId;
    }

    // Getters and Setters
    public String getPageUrl() { return pageUrl; }
    public void setPageUrl(String pageUrl) { this.pageUrl = pageUrl; }

    public String getPageTitle() { return pageTitle; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }

    public String getPageCategory() { return pageCategory; }
    public void setPageCategory(String pageCategory) { this.pageCategory = pageCategory; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public Long getTimeOnPage() { return timeOnPage; }
    public void setTimeOnPage(Long timeOnPage) { this.timeOnPage = timeOnPage; }

    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public String getUtmSource() { return utmSource; }
    public void setUtmSource(String utmSource) { this.utmSource = utmSource; }

    public String getUtmMedium() { return utmMedium; }
    public void setUtmMedium(String utmMedium) { this.utmMedium = utmMedium; }

    public String getUtmCampaign() { return utmCampaign; }
    public void setUtmCampaign(String utmCampaign) { this.utmCampaign = utmCampaign; }

    public String getUtmTerm() { return utmTerm; }
    public void setUtmTerm(String utmTerm) { this.utmTerm = utmTerm; }

    public String getUtmContent() { return utmContent; }
    public void setUtmContent(String utmContent) { this.utmContent = utmContent; }

    @Override
    public String toString() {
        return "PageVisitRequest{" +
                "pageUrl='" + pageUrl + '\'' +
                ", pageTitle='" + pageTitle + '\'' +
                ", pageCategory='" + pageCategory + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", timeOnPage=" + timeOnPage +
                '}';
    }
} 
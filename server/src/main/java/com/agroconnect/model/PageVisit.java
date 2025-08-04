package com.agroconnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Entity for tracking page visits and user behavior
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Document(collection = "page_visits")
public class PageVisit {

    @Id
    private String id;

    @NotBlank(message = "Page URL is required")
    @Indexed
    private String pageUrl;

    @NotBlank(message = "Page title is required")
    private String pageTitle;

    @NotBlank(message = "Page category is required")
    @Indexed
    private String pageCategory;

    private String userId; // Optional - for logged-in users

    @NotBlank(message = "Session ID is required")
    @Indexed
    private String sessionId;

    @NotBlank(message = "IP address is required")
    private String ipAddress;

    private String userAgent;

    @NotNull(message = "Visit timestamp is required")
    @Indexed
    private LocalDateTime visitTimestamp;

    private Long timeOnPage; // Time spent on page in seconds

    private String referrer; // Previous page URL

    private String deviceType; // mobile, desktop, tablet

    private String browser; // Chrome, Firefox, Safari, etc.

    private String operatingSystem; // Windows, macOS, Linux, iOS, Android

    private String country; // Country from IP geolocation

    private String city; // City from IP geolocation

    private String utmSource; // UTM parameters for tracking

    private String utmMedium;

    private String utmCampaign;

    private String utmTerm;

    private String utmContent;

    // Constructor
    public PageVisit() {
        this.visitTimestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getVisitTimestamp() { return visitTimestamp; }
    public void setVisitTimestamp(LocalDateTime visitTimestamp) { this.visitTimestamp = visitTimestamp; }

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

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

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
        return "PageVisit{" +
                "id='" + id + '\'' +
                ", pageUrl='" + pageUrl + '\'' +
                ", pageTitle='" + pageTitle + '\'' +
                ", pageCategory='" + pageCategory + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", visitTimestamp=" + visitTimestamp +
                '}';
    }
} 
package com.agroconnect.controller;

import com.agroconnect.analytics.AnalyticsService;
import com.agroconnect.dto.ApiResponse;
import com.agroconnect.dto.PageVisitRequest;
import com.agroconnect.model.PageVisit;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for analytics and reporting operations
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://agroconnect-world.com"})
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * POST /api/analytics/track - Track a page visit
     */
    @PostMapping("/track")
    public ResponseEntity<ApiResponse<PageVisit>> trackPageVisit(
            @Valid @RequestBody PageVisitRequest request,
            HttpServletRequest httpRequest) {
        
        logger.info("Tracking page visit: {} - {}", request.getPageUrl(), request.getPageTitle());

        try {
            // Extract client information
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            PageVisit savedVisit = analyticsService.trackPageVisit(request, ipAddress, userAgent);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Page visit tracked successfully", savedVisit));

        } catch (Exception e) {
            logger.error("Error tracking page visit: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to track page visit"));
        }
    }

    /**
     * GET /api/analytics/dashboard - Get comprehensive dashboard analytics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsService.DashboardAnalytics>> getDashboardAnalytics() {
        logger.info("Dashboard analytics requested");

        try {
            AnalyticsService.DashboardAnalytics analytics = analyticsService.getDashboardAnalytics();
            return ResponseEntity.ok(ApiResponse.success("Dashboard analytics retrieved successfully", analytics));
        } catch (Exception e) {
            logger.error("Error retrieving dashboard analytics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve dashboard analytics"));
        }
    }

    /**
     * GET /api/analytics/summary - Get analytics summary (for admin dashboard)
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary() {
        logger.info("Analytics summary requested");

        try {
            AnalyticsService.DashboardAnalytics dashboard = analyticsService.getDashboardAnalytics();
            AnalyticsService.PageVisitStatistics pageStats = dashboard.getPageVisitStatistics();
            AnalyticsService.PerformanceMetrics performance = analyticsService.getPerformanceMetrics();
            AnalyticsService.ConversionAnalytics conversion = analyticsService.getConversionAnalytics();

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalVisits", pageStats.getTotalVisits());
            summary.put("uniqueSessions", pageStats.getUniqueSessions());
            summary.put("uniqueUsers", pageStats.getUniqueUsers());
            summary.put("totalContacts", dashboard.getContactStatistics().getTotalContacts());
            summary.put("todayVisits", performance.getTodayVisits());
            summary.put("todayContacts", performance.getTodayContacts());
            summary.put("avgTimeOnPage", pageStats.getAverageTimeOnPage());
            summary.put("contactConversionRate", conversion.getContactConversionRate());
            summary.put("mostVisitedPages", pageStats.getMostVisitedPages());
            summary.put("deviceDistribution", pageStats.getDeviceDistribution());
            summary.put("browserDistribution", pageStats.getBrowserDistribution());
            summary.put("pageCategoryDistribution", pageStats.getPageCategoryDistribution());
            summary.put("dailyPageVisitTrends", dashboard.getDailyPageVisitTrends());
            summary.put("dailyContactTrends", dashboard.getDailyContactTrends());
            summary.put("performanceMetrics", performance);
            summary.put("conversionAnalytics", conversion);

            return ResponseEntity.ok(ApiResponse.success("Analytics summary retrieved successfully", summary));
        } catch (Exception e) {
            logger.error("Error retrieving analytics summary: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve analytics summary"));
        }
    }

    /**
     * GET /api/analytics/page-visits - Get page visits with pagination
     */
    @GetMapping("/page-visits")
    public ResponseEntity<ApiResponse<Page<PageVisit>>> getPageVisits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        logger.debug("Getting page visits with pagination: page={}, size={}", page, size);

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PageVisit> visits = analyticsService.getPageVisits(pageable);
            return ResponseEntity.ok(ApiResponse.success("Page visits retrieved successfully", visits));
        } catch (Exception e) {
            logger.error("Error retrieving page visits: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve page visits"));
        }
    }

    /**
     * GET /api/analytics/most-visited-pages - Get most visited pages
     */
    @GetMapping("/most-visited-pages")
    public ResponseEntity<ApiResponse<List<PageVisit>>> getMostVisitedPages(
            @RequestParam(defaultValue = "10") int limit) {
        
        logger.debug("Getting most visited pages with limit: {}", limit);

        try {
            List<PageVisit> pages = analyticsService.getMostVisitedPages(limit);
            return ResponseEntity.ok(ApiResponse.success("Most visited pages retrieved successfully", pages));
        } catch (Exception e) {
            logger.error("Error retrieving most visited pages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve most visited pages"));
        }
    }

    /**
     * GET /api/analytics/page-visits/date-range - Get page visits by date range
     */
    @GetMapping("/page-visits/date-range")
    public ResponseEntity<ApiResponse<List<PageVisit>>> getPageVisitsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        logger.debug("Getting page visits by date range: {} to {}", startDate, endDate);

        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            List<PageVisit> visits = analyticsService.getPageVisitsByDateRange(start, end);
            return ResponseEntity.ok(ApiResponse.success("Page visits retrieved successfully", visits));
        } catch (Exception e) {
            logger.error("Error retrieving page visits by date range: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve page visits"));
        }
    }

    /**
     * GET /api/analytics/farm-type-distribution - Get farm type distribution
     */
    @GetMapping("/farm-type-distribution")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getFarmTypeDistribution() {
        logger.debug("Farm type distribution requested");

        try {
            Map<String, Long> distribution = analyticsService.getFarmTypeDistribution();
            return ResponseEntity.ok(ApiResponse.success("Farm type distribution retrieved successfully", distribution));
        } catch (Exception e) {
            logger.error("Error retrieving farm type distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve farm type distribution"));
        }
    }

    /**
     * GET /api/analytics/location-distribution - Get location distribution
     */
    @GetMapping("/location-distribution")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getLocationDistribution() {
        logger.debug("Location distribution requested");

        try {
            Map<String, Long> distribution = analyticsService.getLocationDistribution();
            return ResponseEntity.ok(ApiResponse.success("Location distribution retrieved successfully", distribution));
        } catch (Exception e) {
            logger.error("Error retrieving location distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve location distribution"));
        }
    }

    /**
     * GET /api/analytics/contact-method-preference - Get contact method preference
     */
    @GetMapping("/contact-method-preference")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getContactMethodPreference() {
        logger.debug("Contact method preference requested");

        try {
            Map<String, Long> preference = analyticsService.getContactMethodPreference();
            return ResponseEntity.ok(ApiResponse.success("Contact method preference retrieved successfully", preference));
        } catch (Exception e) {
            logger.error("Error retrieving contact method preference: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contact method preference"));
        }
    }

    /**
     * GET /api/analytics/daily-trends - Get daily trends
     */
    @GetMapping("/daily-trends")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyTrends(
            @RequestParam(defaultValue = "7") int days) {
        logger.debug("Daily trends requested for {} days", days);

        try {
            Map<String, Long> contactTrends = analyticsService.getDailyContactTrends(days);
            Map<String, Long> pageVisitTrends = analyticsService.getDailyPageVisitTrends(days);
            
            Map<String, Object> trends = Map.of(
                "contactTrends", contactTrends,
                "pageVisitTrends", pageVisitTrends,
                "days", days
            );
            
            return ResponseEntity.ok(ApiResponse.success("Daily trends retrieved successfully", trends));
        } catch (Exception e) {
            logger.error("Error retrieving daily trends: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve daily trends"));
        }
    }

    /**
     * GET /api/analytics/conversion - Get conversion analytics
     */
    @GetMapping("/conversion")
    public ResponseEntity<ApiResponse<AnalyticsService.ConversionAnalytics>> getConversionAnalytics() {
        logger.info("Conversion analytics requested");

        try {
            AnalyticsService.ConversionAnalytics analytics = analyticsService.getConversionAnalytics();
            return ResponseEntity.ok(ApiResponse.success("Conversion analytics retrieved successfully", analytics));
        } catch (Exception e) {
            logger.error("Error retrieving conversion analytics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve conversion analytics"));
        }
    }

    /**
     * GET /api/analytics/performance - Get performance metrics
     */
    @GetMapping("/performance")
    public ResponseEntity<ApiResponse<AnalyticsService.PerformanceMetrics>> getPerformanceMetrics() {
        logger.info("Performance metrics requested");

        try {
            AnalyticsService.PerformanceMetrics metrics = analyticsService.getPerformanceMetrics();
            return ResponseEntity.ok(ApiResponse.success("Performance metrics retrieved successfully", metrics));
        } catch (Exception e) {
            logger.error("Error retrieving performance metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve performance metrics"));
        }
    }

    /**
     * GET /api/analytics/device-distribution - Get device distribution
     */
    @GetMapping("/device-distribution")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDeviceDistribution() {
        logger.debug("Device distribution requested");

        try {
            Map<String, Long> distribution = analyticsService.getDeviceDistribution();
            return ResponseEntity.ok(ApiResponse.success("Device distribution retrieved successfully", distribution));
        } catch (Exception e) {
            logger.error("Error retrieving device distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve device distribution"));
        }
    }

    /**
     * GET /api/analytics/browser-distribution - Get browser distribution
     */
    @GetMapping("/browser-distribution")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getBrowserDistribution() {
        logger.debug("Browser distribution requested");

        try {
            Map<String, Long> distribution = analyticsService.getBrowserDistribution();
            return ResponseEntity.ok(ApiResponse.success("Browser distribution retrieved successfully", distribution));
        } catch (Exception e) {
            logger.error("Error retrieving browser distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve browser distribution"));
        }
    }

    /**
     * GET /api/analytics/page-category-distribution - Get page category distribution
     */
    @GetMapping("/page-category-distribution")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getPageCategoryDistribution() {
        logger.debug("Page category distribution requested");

        try {
            Map<String, Long> distribution = analyticsService.getPageCategoryDistribution();
            return ResponseEntity.ok(ApiResponse.success("Page category distribution retrieved successfully", distribution));
        } catch (Exception e) {
            logger.error("Error retrieving page category distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve page category distribution"));
        }
    }

    /**
     * Helper method to get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 
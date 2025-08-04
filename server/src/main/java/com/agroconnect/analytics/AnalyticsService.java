package com.agroconnect.analytics;

import com.agroconnect.contact.ContactService;
import com.agroconnect.dto.PageVisitRequest;
import com.agroconnect.model.Contact;
import com.agroconnect.model.PageVisit;
import com.agroconnect.repository.PageVisitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for analytics and reporting functionality
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);

    private final ContactService contactService;
    private final PageVisitRepository pageVisitRepository;

    @Autowired
    public AnalyticsService(ContactService contactService, PageVisitRepository pageVisitRepository) {
        this.contactService = contactService;
        this.pageVisitRepository = pageVisitRepository;
    }

    /**
     * Track a page visit
     */
    public PageVisit trackPageVisit(PageVisitRequest request, String ipAddress, String userAgent) {
        logger.info("Tracking page visit: {} - {}", request.getPageUrl(), request.getPageTitle());

        try {
            PageVisit pageVisit = new PageVisit();
            pageVisit.setPageUrl(request.getPageUrl());
            pageVisit.setPageTitle(request.getPageTitle());
            pageVisit.setPageCategory(request.getPageCategory());
            pageVisit.setUserId(request.getUserId());
            pageVisit.setSessionId(request.getSessionId());
            pageVisit.setIpAddress(ipAddress);
            pageVisit.setUserAgent(userAgent);
            pageVisit.setTimeOnPage(request.getTimeOnPage());
            pageVisit.setReferrer(request.getReferrer());
            pageVisit.setDeviceType(request.getDeviceType());
            pageVisit.setBrowser(request.getBrowser());
            pageVisit.setOperatingSystem(request.getOperatingSystem());
            pageVisit.setUtmSource(request.getUtmSource());
            pageVisit.setUtmMedium(request.getUtmMedium());
            pageVisit.setUtmCampaign(request.getUtmCampaign());
            pageVisit.setUtmTerm(request.getUtmTerm());
            pageVisit.setUtmContent(request.getUtmContent());

            // TODO: Add geolocation service integration
            // pageVisit.setCountry(geolocationService.getCountry(ipAddress));
            // pageVisit.setCity(geolocationService.getCity(ipAddress));

            PageVisit savedVisit = pageVisitRepository.save(pageVisit);
            logger.info("Page visit tracked successfully with ID: {}", savedVisit.getId());

            return savedVisit;
        } catch (Exception e) {
            logger.error("Error tracking page visit: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to track page visit", e);
        }
    }

    /**
     * Get comprehensive dashboard analytics
     */
    public DashboardAnalytics getDashboardAnalytics() {
        logger.info("Generating dashboard analytics");

        try {
            // Get contact statistics
            ContactService.ContactStatistics contactStats = contactService.getStatistics();
            
            // Get today's contacts
            List<Contact> todayContacts = contactService.findTodayContacts();
            
            // Get recent contacts (last 7 days)
            List<Contact> recentContacts = getRecentContacts(7);
            
            // Get page visit statistics
            PageVisitStatistics pageVisitStats = getPageVisitStatistics();
            
            // Generate farm type distribution
            Map<String, Long> farmTypeDistribution = getFarmTypeDistribution();
            
            // Generate location distribution
            Map<String, Long> locationDistribution = getLocationDistribution();
            
            // Generate contact method preference
            Map<String, Long> contactMethodPreference = getContactMethodPreference();
            
            // Generate daily contact trends
            Map<String, Long> dailyContactTrends = getDailyContactTrends(7);
            
            // Generate daily page visit trends
            Map<String, Long> dailyPageVisitTrends = getDailyPageVisitTrends(7);
            
            return new DashboardAnalytics(
                contactStats,
                pageVisitStats,
                todayContacts.size(),
                recentContacts.size(),
                farmTypeDistribution,
                locationDistribution,
                contactMethodPreference,
                dailyContactTrends,
                dailyPageVisitTrends
            );
        } catch (Exception e) {
            logger.error("Error generating dashboard analytics: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate analytics", e);
        }
    }

    /**
     * Get page visit statistics
     */
    public PageVisitStatistics getPageVisitStatistics() {
        logger.debug("Generating page visit statistics");
        
        try {
            long totalVisits = pageVisitRepository.count();
            long uniqueSessions = pageVisitRepository.findDistinctSessionIds().size();
            long uniqueUsers = pageVisitRepository.findDistinctUserIds().size();
            
            // Get most visited pages
            List<PageVisit> mostVisitedPages = pageVisitRepository.findMostVisitedPages(
                PageRequest.of(0, 10)).getContent();
            
            // Get device distribution
            Map<String, Long> deviceDistribution = getDeviceDistribution();
            
            // Get browser distribution
            Map<String, Long> browserDistribution = getBrowserDistribution();
            
            // Get page category distribution
            Map<String, Long> pageCategoryDistribution = getPageCategoryDistribution();
            
            // Get average time on page
            double avgTimeOnPage = getAverageTimeOnPage();
            
            return new PageVisitStatistics(
                totalVisits,
                uniqueSessions,
                uniqueUsers,
                mostVisitedPages,
                deviceDistribution,
                browserDistribution,
                pageCategoryDistribution,
                avgTimeOnPage
            );
        } catch (Exception e) {
            logger.error("Error generating page visit statistics: {}", e.getMessage(), e);
            return new PageVisitStatistics(0, 0, 0, new ArrayList<>(), new HashMap<>(), new HashMap<>(), new HashMap<>(), 0.0);
        }
    }

    /**
     * Get most visited pages
     */
    public List<PageVisit> getMostVisitedPages(int limit) {
        logger.debug("Getting most visited pages with limit: {}", limit);
        
        try {
            return pageVisitRepository.findMostVisitedPages(PageRequest.of(0, limit)).getContent();
        } catch (Exception e) {
            logger.error("Error getting most visited pages: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Get page visits with pagination
     */
    public Page<PageVisit> getPageVisits(Pageable pageable) {
        logger.debug("Getting page visits with pagination: {}", pageable);
        
        try {
            return pageVisitRepository.findAllByOrderByVisitTimestampDesc(pageable);
        } catch (Exception e) {
            logger.error("Error getting page visits: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get page visits", e);
        }
    }

    /**
     * Get page visits by date range
     */
    public List<PageVisit> getPageVisitsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Getting page visits by date range: {} to {}", startDate, endDate);
        
        try {
            return pageVisitRepository.findByVisitTimestampBetween(startDate, endDate);
        } catch (Exception e) {
            logger.error("Error getting page visits by date range: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Get device distribution
     */
    public Map<String, Long> getDeviceDistribution() {
        logger.debug("Generating device distribution");
        
        try {
            List<PageVisit> allVisits = pageVisitRepository.findAll();
            
            return allVisits.stream()
                .filter(visit -> visit.getDeviceType() != null && !visit.getDeviceType().trim().isEmpty())
                .collect(Collectors.groupingBy(
                    PageVisit::getDeviceType,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating device distribution: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get browser distribution
     */
    public Map<String, Long> getBrowserDistribution() {
        logger.debug("Generating browser distribution");
        
        try {
            List<PageVisit> allVisits = pageVisitRepository.findAll();
            
            return allVisits.stream()
                .filter(visit -> visit.getBrowser() != null && !visit.getBrowser().trim().isEmpty())
                .collect(Collectors.groupingBy(
                    PageVisit::getBrowser,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating browser distribution: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get page category distribution
     */
    public Map<String, Long> getPageCategoryDistribution() {
        logger.debug("Generating page category distribution");
        
        try {
            List<PageVisit> allVisits = pageVisitRepository.findAll();
            
            return allVisits.stream()
                .filter(visit -> visit.getPageCategory() != null && !visit.getPageCategory().trim().isEmpty())
                .collect(Collectors.groupingBy(
                    PageVisit::getPageCategory,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating page category distribution: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get average time on page
     */
    public double getAverageTimeOnPage() {
        logger.debug("Calculating average time on page");
        
        try {
            List<PageVisit> visitsWithTime = pageVisitRepository.findVisitsWithTimeOnPage();
            
            if (visitsWithTime.isEmpty()) {
                return 0.0;
            }
            
            double totalTime = visitsWithTime.stream()
                .mapToLong(visit -> visit.getTimeOnPage() != null ? visit.getTimeOnPage() : 0)
                .sum();
            
            return totalTime / visitsWithTime.size();
        } catch (Exception e) {
            logger.error("Error calculating average time on page: {}", e.getMessage(), e);
            return 0.0;
        }
    }

    /**
     * Get daily page visit trends
     */
    public Map<String, Long> getDailyPageVisitTrends(int days) {
        logger.debug("Generating daily page visit trends for last {} days", days);
        
        try {
            LocalDateTime startDate = LocalDateTime.now().minusDays(days);
            LocalDateTime endDate = LocalDateTime.now();
            
            List<PageVisit> recentVisits = pageVisitRepository.findByVisitTimestampBetween(startDate, endDate);
            
            return recentVisits.stream()
                .filter(visit -> visit.getVisitTimestamp() != null)
                .collect(Collectors.groupingBy(
                    visit -> visit.getVisitTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating daily page visit trends: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get farm type distribution analytics
     */
    public Map<String, Long> getFarmTypeDistribution() {
        logger.debug("Generating farm type distribution");
        
        try {
            List<Contact> allContacts = contactService.findAll(null).getContent();
            
            return allContacts.stream()
                .filter(contact -> contact.getFarmType() != null && !contact.getFarmType().trim().isEmpty())
                .collect(Collectors.groupingBy(
                    Contact::getFarmType,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating farm type distribution: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get location distribution analytics
     */
    public Map<String, Long> getLocationDistribution() {
        logger.debug("Generating location distribution");
        
        try {
            List<Contact> allContacts = contactService.findAll(null).getContent();
            
            return allContacts.stream()
                .filter(contact -> contact.getLocation() != null && !contact.getLocation().trim().isEmpty())
                .collect(Collectors.groupingBy(
                    Contact::getLocation,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating location distribution: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get contact method preference analytics
     */
    public Map<String, Long> getContactMethodPreference() {
        logger.debug("Generating contact method preference");
        
        try {
            List<Contact> allContacts = contactService.findAll(null).getContent();
            
            return allContacts.stream()
                .filter(contact -> contact.getPreferredContactMethod() != null)
                .collect(Collectors.groupingBy(
                    Contact::getPreferredContactMethod,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating contact method preference: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get daily contact trends for the last N days
     */
    public Map<String, Long> getDailyContactTrends(int days) {
        logger.debug("Generating daily contact trends for last {} days", days);
        
        try {
            List<Contact> recentContacts = getRecentContacts(days);
            
            return recentContacts.stream()
                .filter(contact -> contact.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                    contact -> contact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                    Collectors.counting()
                ));
        } catch (Exception e) {
            logger.error("Error generating daily contact trends: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get conversion rate analytics
     */
    public ConversionAnalytics getConversionAnalytics() {
        logger.info("Generating conversion analytics");
        
        try {
            ContactService.ContactStatistics stats = contactService.getStatistics();
            PageVisitStatistics pageVisitStats = getPageVisitStatistics();
            
            double totalContacts = stats.getTotalContacts();
            double processedContacts = stats.getProcessedContacts();
            double newsletterSubscribers = stats.getNewsletterSubscribers();
            double totalVisits = pageVisitStats.getTotalVisits();
            
            double processingRate = totalContacts > 0 ? (processedContacts / totalContacts) * 100 : 0;
            double newsletterRate = totalContacts > 0 ? (newsletterSubscribers / totalContacts) * 100 : 0;
            double contactConversionRate = totalVisits > 0 ? (totalContacts / totalVisits) * 100 : 0;
            
            return new ConversionAnalytics(
                processingRate,
                newsletterRate,
                contactConversionRate,
                (long) processedContacts,
                (long) newsletterSubscribers,
                (long) totalVisits
            );
        } catch (Exception e) {
            logger.error("Error generating conversion analytics: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate conversion analytics", e);
        }
    }

    /**
     * Get performance metrics
     */
    public PerformanceMetrics getPerformanceMetrics() {
        logger.info("Generating performance metrics");
        
        try {
            long totalContacts = contactService.getStatistics().getTotalContacts();
            long todayContacts = contactService.findTodayContacts().size();
            long totalVisits = pageVisitRepository.count();
            long todayVisits = getPageVisitsByDateRange(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0),
                LocalDateTime.now()
            ).size();
            
            // Calculate average contacts per day (last 30 days)
            List<Contact> lastMonthContacts = getRecentContacts(30);
            double avgContactsPerDay = lastMonthContacts.size() / 30.0;
            
            // Calculate average visits per day (last 30 days)
            List<PageVisit> lastMonthVisits = getPageVisitsByDateRange(
                LocalDateTime.now().minusDays(30),
                LocalDateTime.now()
            );
            double avgVisitsPerDay = lastMonthVisits.size() / 30.0;
            
            // Calculate growth rate (comparing this week to last week)
            long thisWeekContacts = getRecentContacts(7).size();
            long lastWeekContacts = getContactsBetweenDays(8, 14).size();
            double contactGrowthRate = lastWeekContacts > 0 ? ((thisWeekContacts - lastWeekContacts) / (double) lastWeekContacts) * 100 : 0;
            
            long thisWeekVisits = getPageVisitsByDateRange(
                LocalDateTime.now().minusDays(7),
                LocalDateTime.now()
            ).size();
            long lastWeekVisits = getPageVisitsByDateRange(
                LocalDateTime.now().minusDays(14),
                LocalDateTime.now().minusDays(7)
            ).size();
            double visitGrowthRate = lastWeekVisits > 0 ? ((thisWeekVisits - lastWeekVisits) / (double) lastWeekVisits) * 100 : 0;
            
            return new PerformanceMetrics(
                totalContacts,
                todayContacts,
                totalVisits,
                todayVisits,
                avgContactsPerDay,
                avgVisitsPerDay,
                contactGrowthRate,
                visitGrowthRate,
                thisWeekContacts,
                lastWeekContacts,
                thisWeekVisits,
                lastWeekVisits
            );
        } catch (Exception e) {
            logger.error("Error generating performance metrics: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate performance metrics", e);
        }
    }

    /**
     * Get recent contacts for the last N days
     */
    private List<Contact> getRecentContacts(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();
        
        // This would need to be implemented in ContactService
        // For now, we'll get all contacts and filter
        return contactService.findAll(null).getContent().stream()
            .filter(contact -> contact.getCreatedAt() != null && 
                             contact.getCreatedAt().isAfter(startDate) && 
                             contact.getCreatedAt().isBefore(endDate))
            .collect(Collectors.toList());
    }

    /**
     * Get contacts between specific days
     */
    private List<Contact> getContactsBetweenDays(int startDays, int endDays) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(endDays);
        LocalDateTime endDate = LocalDateTime.now().minusDays(startDays);
        
        return contactService.findAll(null).getContent().stream()
            .filter(contact -> contact.getCreatedAt() != null && 
                             contact.getCreatedAt().isAfter(startDate) && 
                             contact.getCreatedAt().isBefore(endDate))
            .collect(Collectors.toList());
    }

    /**
     * Dashboard Analytics DTO
     */
    public static class DashboardAnalytics {
        private final ContactService.ContactStatistics contactStatistics;
        private final PageVisitStatistics pageVisitStatistics;
        private final int todayContacts;
        private final int recentContacts;
        private final Map<String, Long> farmTypeDistribution;
        private final Map<String, Long> locationDistribution;
        private final Map<String, Long> contactMethodPreference;
        private final Map<String, Long> dailyContactTrends;
        private final Map<String, Long> dailyPageVisitTrends;

        public DashboardAnalytics(ContactService.ContactStatistics contactStatistics,
                                PageVisitStatistics pageVisitStatistics,
                                int todayContacts, 
                                int recentContacts,
                                Map<String, Long> farmTypeDistribution,
                                Map<String, Long> locationDistribution,
                                Map<String, Long> contactMethodPreference,
                                Map<String, Long> dailyContactTrends,
                                Map<String, Long> dailyPageVisitTrends) {
            this.contactStatistics = contactStatistics;
            this.pageVisitStatistics = pageVisitStatistics;
            this.todayContacts = todayContacts;
            this.recentContacts = recentContacts;
            this.farmTypeDistribution = farmTypeDistribution;
            this.locationDistribution = locationDistribution;
            this.contactMethodPreference = contactMethodPreference;
            this.dailyContactTrends = dailyContactTrends;
            this.dailyPageVisitTrends = dailyPageVisitTrends;
        }

        // Getters
        public ContactService.ContactStatistics getContactStatistics() { return contactStatistics; }
        public PageVisitStatistics getPageVisitStatistics() { return pageVisitStatistics; }
        public int getTodayContacts() { return todayContacts; }
        public int getRecentContacts() { return recentContacts; }
        public Map<String, Long> getFarmTypeDistribution() { return farmTypeDistribution; }
        public Map<String, Long> getLocationDistribution() { return locationDistribution; }
        public Map<String, Long> getContactMethodPreference() { return contactMethodPreference; }
        public Map<String, Long> getDailyContactTrends() { return dailyContactTrends; }
        public Map<String, Long> getDailyPageVisitTrends() { return dailyPageVisitTrends; }
    }

    /**
     * Page Visit Statistics DTO
     */
    public static class PageVisitStatistics {
        private final long totalVisits;
        private final long uniqueSessions;
        private final long uniqueUsers;
        private final List<PageVisit> mostVisitedPages;
        private final Map<String, Long> deviceDistribution;
        private final Map<String, Long> browserDistribution;
        private final Map<String, Long> pageCategoryDistribution;
        private final double averageTimeOnPage;

        public PageVisitStatistics(long totalVisits, long uniqueSessions, long uniqueUsers,
                                 List<PageVisit> mostVisitedPages,
                                 Map<String, Long> deviceDistribution,
                                 Map<String, Long> browserDistribution,
                                 Map<String, Long> pageCategoryDistribution,
                                 double averageTimeOnPage) {
            this.totalVisits = totalVisits;
            this.uniqueSessions = uniqueSessions;
            this.uniqueUsers = uniqueUsers;
            this.mostVisitedPages = mostVisitedPages;
            this.deviceDistribution = deviceDistribution;
            this.browserDistribution = browserDistribution;
            this.pageCategoryDistribution = pageCategoryDistribution;
            this.averageTimeOnPage = averageTimeOnPage;
        }

        // Getters
        public long getTotalVisits() { return totalVisits; }
        public long getUniqueSessions() { return uniqueSessions; }
        public long getUniqueUsers() { return uniqueUsers; }
        public List<PageVisit> getMostVisitedPages() { return mostVisitedPages; }
        public Map<String, Long> getDeviceDistribution() { return deviceDistribution; }
        public Map<String, Long> getBrowserDistribution() { return browserDistribution; }
        public Map<String, Long> getPageCategoryDistribution() { return pageCategoryDistribution; }
        public double getAverageTimeOnPage() { return averageTimeOnPage; }
    }

    /**
     * Conversion Analytics DTO
     */
    public static class ConversionAnalytics {
        private final double processingRate;
        private final double newsletterRate;
        private final double contactConversionRate;
        private final long processedContacts;
        private final long newsletterSubscribers;
        private final long totalVisits;

        public ConversionAnalytics(double processingRate, double newsletterRate, double contactConversionRate,
                                 long processedContacts, long newsletterSubscribers, long totalVisits) {
            this.processingRate = processingRate;
            this.newsletterRate = newsletterRate;
            this.contactConversionRate = contactConversionRate;
            this.processedContacts = processedContacts;
            this.newsletterSubscribers = newsletterSubscribers;
            this.totalVisits = totalVisits;
        }

        // Getters
        public double getProcessingRate() { return processingRate; }
        public double getNewsletterRate() { return newsletterRate; }
        public double getContactConversionRate() { return contactConversionRate; }
        public long getProcessedContacts() { return processedContacts; }
        public long getNewsletterSubscribers() { return newsletterSubscribers; }
        public long getTotalVisits() { return totalVisits; }
    }

    /**
     * Performance Metrics DTO
     */
    public static class PerformanceMetrics {
        private final long totalContacts;
        private final long todayContacts;
        private final long totalVisits;
        private final long todayVisits;
        private final double avgContactsPerDay;
        private final double avgVisitsPerDay;
        private final double contactGrowthRate;
        private final double visitGrowthRate;
        private final long thisWeekContacts;
        private final long lastWeekContacts;
        private final long thisWeekVisits;
        private final long lastWeekVisits;

        public PerformanceMetrics(long totalContacts, long todayContacts, long totalVisits, long todayVisits,
                                double avgContactsPerDay, double avgVisitsPerDay,
                                double contactGrowthRate, double visitGrowthRate,
                                long thisWeekContacts, long lastWeekContacts,
                                long thisWeekVisits, long lastWeekVisits) {
            this.totalContacts = totalContacts;
            this.todayContacts = todayContacts;
            this.totalVisits = totalVisits;
            this.todayVisits = todayVisits;
            this.avgContactsPerDay = avgContactsPerDay;
            this.avgVisitsPerDay = avgVisitsPerDay;
            this.contactGrowthRate = contactGrowthRate;
            this.visitGrowthRate = visitGrowthRate;
            this.thisWeekContacts = thisWeekContacts;
            this.lastWeekContacts = lastWeekContacts;
            this.thisWeekVisits = thisWeekVisits;
            this.lastWeekVisits = lastWeekVisits;
        }

        // Getters
        public long getTotalContacts() { return totalContacts; }
        public long getTodayContacts() { return todayContacts; }
        public long getTotalVisits() { return totalVisits; }
        public long getTodayVisits() { return todayVisits; }
        public double getAvgContactsPerDay() { return avgContactsPerDay; }
        public double getAvgVisitsPerDay() { return avgVisitsPerDay; }
        public double getContactGrowthRate() { return contactGrowthRate; }
        public double getVisitGrowthRate() { return visitGrowthRate; }
        public long getThisWeekContacts() { return thisWeekContacts; }
        public long getLastWeekContacts() { return lastWeekContacts; }
        public long getThisWeekVisits() { return thisWeekVisits; }
        public long getLastWeekVisits() { return lastWeekVisits; }
    }
} 
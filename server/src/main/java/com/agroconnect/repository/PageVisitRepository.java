package com.agroconnect.repository;

import com.agroconnect.model.PageVisit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Repository for page visit analytics data
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Repository
public interface PageVisitRepository extends MongoRepository<PageVisit, String> {

    /**
     * Find page visits by session ID
     */
    List<PageVisit> findBySessionId(String sessionId);

    /**
     * Find page visits by user ID
     */
    List<PageVisit> findByUserId(String userId);

    /**
     * Find page visits by page category
     */
    List<PageVisit> findByPageCategory(String pageCategory);

    /**
     * Find page visits by page URL
     */
    List<PageVisit> findByPageUrl(String pageUrl);

    /**
     * Find page visits within a date range
     */
    List<PageVisit> findByVisitTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find page visits by device type
     */
    List<PageVisit> findByDeviceType(String deviceType);

    /**
     * Find page visits by browser
     */
    List<PageVisit> findByBrowser(String browser);

    /**
     * Find page visits by country
     */
    List<PageVisit> findByCountry(String country);

    /**
     * Find page visits by UTM source
     */
    List<PageVisit> findByUtmSource(String utmSource);

    /**
     * Find page visits by UTM campaign
     */
    List<PageVisit> findByUtmCampaign(String utmCampaign);

    /**
     * Count page visits by page category
     */
    @Query(value = "{}", fields = "{'pageCategory': 1}")
    List<PageVisit> findAllPageCategories();

    /**
     * Get most visited pages
     */
    @Query(value = "{}", fields = "{'pageUrl': 1, 'pageTitle': 1, 'pageCategory': 1}")
    Page<PageVisit> findMostVisitedPages(Pageable pageable);

    /**
     * Get page visits with pagination
     */
    Page<PageVisit> findAllByOrderByVisitTimestampDesc(Pageable pageable);

    /**
     * Count total page visits
     */
    long count();

    /**
     * Count page visits by page category
     */
    long countByPageCategory(String pageCategory);

    /**
     * Count page visits by device type
     */
    long countByDeviceType(String deviceType);

    /**
     * Count page visits by browser
     */
    long countByBrowser(String browser);

    /**
     * Count page visits by country
     */
    long countByCountry(String country);

    /**
     * Count unique sessions
     */
    @Query(value = "{}", fields = "{'sessionId': 1}")
    List<PageVisit> findDistinctSessionIds();

    /**
     * Count unique users
     */
    @Query(value = "{'userId': {$ne: null}}", fields = "{'userId': 1}")
    List<PageVisit> findDistinctUserIds();

    /**
     * Get average time on page
     */
    @Query(value = "{'timeOnPage': {$ne: null}}", fields = "{'timeOnPage': 1}")
    List<PageVisit> findTimeOnPageData();

    /**
     * Get page visits for a specific date range with pagination
     */
    Page<PageVisit> findByVisitTimestampBetweenOrderByVisitTimestampDesc(
            LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Get page visits by page category with pagination
     */
    Page<PageVisit> findByPageCategoryOrderByVisitTimestampDesc(String pageCategory, Pageable pageable);

    /**
     * Get page visits by device type with pagination
     */
    Page<PageVisit> findByDeviceTypeOrderByVisitTimestampDesc(String deviceType, Pageable pageable);

    /**
     * Get page visits by browser with pagination
     */
    Page<PageVisit> findByBrowserOrderByVisitTimestampDesc(String browser, Pageable pageable);

    /**
     * Get page visits by country with pagination
     */
    Page<PageVisit> findByCountryOrderByVisitTimestampDesc(String country, Pageable pageable);

    /**
     * Get page visits by UTM source with pagination
     */
    Page<PageVisit> findByUtmSourceOrderByVisitTimestampDesc(String utmSource, Pageable pageable);

    /**
     * Get page visits by UTM campaign with pagination
     */
    Page<PageVisit> findByUtmCampaignOrderByVisitTimestampDesc(String utmCampaign, Pageable pageable);

    /**
     * Get page visits by user ID with pagination
     */
    Page<PageVisit> findByUserIdOrderByVisitTimestampDesc(String userId, Pageable pageable);

    /**
     * Get page visits by session ID with pagination
     */
    Page<PageVisit> findBySessionIdOrderByVisitTimestampDesc(String sessionId, Pageable pageable);

    /**
     * Get page visits by page URL with pagination
     */
    Page<PageVisit> findByPageUrlOrderByVisitTimestampDesc(String pageUrl, Pageable pageable);

    /**
     * Get page visits by operating system
     */
    List<PageVisit> findByOperatingSystem(String operatingSystem);

    /**
     * Count page visits by operating system
     */
    long countByOperatingSystem(String operatingSystem);

    /**
     * Get page visits by city
     */
    List<PageVisit> findByCity(String city);

    /**
     * Count page visits by city
     */
    long countByCity(String city);

    /**
     * Get page visits by referrer
     */
    List<PageVisit> findByReferrer(String referrer);

    /**
     * Count page visits by referrer
     */
    long countByReferrer(String referrer);

    /**
     * Get page visits with time on page data
     */
    @Query(value = "{'timeOnPage': {$gt: 0}}")
    List<PageVisit> findVisitsWithTimeOnPage();

    /**
     * Get page visits with UTM parameters
     */
    @Query(value = "{'utmSource': {$ne: null}}")
    List<PageVisit> findVisitsWithUtmData();

    /**
     * Get page visits with geolocation data
     */
    @Query(value = "{'country': {$ne: null}}")
    List<PageVisit> findVisitsWithGeolocationData();
} 
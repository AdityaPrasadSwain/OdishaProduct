package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Coupon;
import com.odisha.handloom.entity.CouponUsage;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    long countByCouponAndUser(Coupon coupon, User user);

    List<CouponUsage> findByUserOrderByUsedAtDesc(User user);

    @Query("SELECT SUM(cu.discountAmount) FROM CouponUsage cu")
    Double calculateTotalDiscountGiven();

    @Query("SELECT COUNT(DISTINCT cu.user) FROM CouponUsage cu")
    Long countUniqueUsers();

    // Analytics: Daily usage for last N days
    @Query("SELECT CAST(cu.usedAt AS date) as date, COUNT(cu) as count " +
            "FROM CouponUsage cu " +
            "WHERE cu.usedAt >= :startDate " +
            "GROUP BY CAST(cu.usedAt AS date) " +
            "ORDER BY date ASC")
    List<Object[]> getDailyUsageStats(@Param("startDate") LocalDateTime startDate);
}

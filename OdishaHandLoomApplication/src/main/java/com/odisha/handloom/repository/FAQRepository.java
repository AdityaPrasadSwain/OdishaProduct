package com.odisha.handloom.repository;

import com.odisha.handloom.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    @Query("SELECT f FROM FAQ f WHERE LOWER(f.keyword) LIKE %:keyword%")
    List<FAQ> searchByKeyword(String keyword);

    List<FAQ> findByTargetRole(String targetRole);
}

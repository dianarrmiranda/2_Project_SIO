package com.shop_backend.models.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.shop_backend.models.entities.Review;

public interface ReviewRepo extends CrudRepository<Review, Integer> {
    @Query(value="SELECT * FROM Review WHERE id = :id", nativeQuery=true)
    Review findReviewByID(@Param("id") Integer id);
}
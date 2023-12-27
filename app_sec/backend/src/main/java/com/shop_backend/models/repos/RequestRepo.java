package com.shop_backend.models.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.shop_backend.models.entities.Request;

public interface RequestRepo extends CrudRepository<Request, Integer> {
    @Query(value="SELECT * FROM Request WHERE id = :id", nativeQuery=true)
    Request findRequestByID(@Param("id") Integer id);
}
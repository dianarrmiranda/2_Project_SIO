package com.shop_backend.models.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.shop_backend.models.entities.Category;

import java.util.List;

public interface CategoryRepo extends CrudRepository<Category, Integer> {
    @Query(value="SELECT * FROM Category cate", nativeQuery=true)
    List<Category> listCategories();
    
    @Query(value="SELECT * FROM Category WHERE id = :id", nativeQuery=true)
    Category findCategoryByID(@Param("id") Integer id);

    @Query(value="SELECT * FROM Category WHERE Name = :name", nativeQuery=true)
    Category findCategoryByName(@Param("name") String name);
}
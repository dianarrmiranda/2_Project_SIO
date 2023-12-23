package com.shop_backend.models.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.shop_backend.models.entities.Product;

import java.util.List;

public interface ProductRepo extends CrudRepository<Product, Integer> {
    @Query(value="SELECT * FROM Product prod", nativeQuery=true)
    List<Product> listProducts();

    @Query(value="SELECT * FROM Product prod WHERE prod.CATEGORYID = :cat", nativeQuery=true)
    List<Product> listProductsByCategory(@Param("cat") String cat);

    @Query(value="SELECT * FROM Product prod WHERE prod.IS_HOT_DEAL", nativeQuery=true)
    List<Product> listProductsHotDeals();

    @Query(value="SELECT COUNT(id) FROM Product prod", nativeQuery=true)
    String getNumberOfProducts();
    
    @Query(value="SELECT * FROM Product WHERE id = :id", nativeQuery=true)
    Product findProductByID(@Param("id") Integer id);
}
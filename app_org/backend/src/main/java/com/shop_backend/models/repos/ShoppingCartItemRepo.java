package com.shop_backend.models.repos;

import org.springframework.data.repository.CrudRepository;

import com.shop_backend.models.entities.ShoppingCartItem;

public interface ShoppingCartItemRepo extends CrudRepository<ShoppingCartItem, Integer> {
}
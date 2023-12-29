package com.shop_backend.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;
import java.util.LinkedList;

@Entity // This tells Hibernate to make a table out of this class
public class Request {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer ID;

    @OneToMany
    private List<ShoppingCartItem> Items = new LinkedList<ShoppingCartItem>();

    private Double Total;

    public Integer getID() {
        return ID;
    }
    public void setID(Integer iD) {
        ID = iD;
    }
    public List<ShoppingCartItem> getItems() {
        return Items;
    }
    public void setItem(List<ShoppingCartItem> item) {
        Items = item;
    }
    public void addItem(ShoppingCartItem item) {
        Items.add(item);
    }
    public Double getTotal() {
        return Total;
    }
    public void setTotal(Double total) {
        Total = total;
    }

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder();
        result.append("Request totaling [" + Total + "€] with items:\n");
        for (ShoppingCartItem item : Items) {
            result.append(item.toString());
        }
        result.append("\n");
        return result.toString();
    }
}
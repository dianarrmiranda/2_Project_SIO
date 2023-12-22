package com.shop_backend.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Review {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer ID;

    private String UserName;
    private String Header;
    private String Description;
    private Double NumStars;
    
    public Integer getID() {
        return ID;
    }
    public void setID(Integer iD) {
        ID = iD;
    }
    public String getUser() {
        return UserName;
    }
    public void setUser(String userID) {
        UserName = userID;
    }
    public String getHeader() {
        return Header;
    }
    public void setHeader(String header) {
        Header = header;
    }
    public String getDescription() {
        return Description;
    }
    public void setDescription(String description) {
        Description = description;
    }
    public Double getNumStars() {
        return NumStars;
    }
    public void setNumStars(Double numStars) {
        NumStars = numStars;
    }
}
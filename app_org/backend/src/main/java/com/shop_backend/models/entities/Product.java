package com.shop_backend.models.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.LinkedList;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;

@Entity // This tells Hibernate to make a table out of this class
public class Product {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer ID;

    private String Name;
    private String Description;
    private String Origin;
    private String Date;
    private String ImgSource;

    private Boolean IsHotDeal;
    private Double Price;
    private Integer In_Stock;
    private Double Average_Stars;

    @ManyToOne
    @JoinColumn(name = "CategoryID", nullable=false)
    private Category Category;

    @OneToMany
    @JoinColumn(name = "ProdID")
    @JsonIgnore
    private List<Review> Reviews = new LinkedList<Review>();

    public Integer getID() {
        return ID;
    }

    public void setID(Integer iD) {
        ID = iD;
    }

    public String getDate() {
        return Date;
    }

    public void setDate(String date) {
        Date = date;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getOrigin() {
        return Origin;
    }

    public void setOrigin(String origin) {
        Origin = origin;
    }

    public Boolean getIsHotDeal() {
        return IsHotDeal;
    }

    public void setIsHotDeal(Boolean isHotDeal) {
        IsHotDeal = isHotDeal;
    }

    public Double getPrice() {
        return Price;
    }

    public void setPrice(Double price) {
        Price = price;
    }

    public Integer getIn_Stock() {
        return In_Stock;
    }

    public void setIn_Stock(Integer in_Stock) {
        In_Stock = in_Stock;
    }

    public Category getCategory() {
        return Category;
    }

    public void setCategory(Category category) {
        Category = category;
    }

    public String getImgSource() {
        return ImgSource;
    }

    public void setImgSource(String imgSource) {
        ImgSource = imgSource;
    }

    public List<Review> getReviews() {
        return Reviews;
    }

    public void setReviews(List<Review> reviews) {
        Reviews = reviews;
    }

    public void addReview(Review review) {
        Reviews.add(review);
    }

    public Double getAverage_Stars() {
        return Average_Stars;
    }

    public void setAverage_Stars(Double average_stars) {
        Average_Stars = average_stars;
    }

    public void updateAverage_Stars() {
        double tempAvg = 0;
        for (Review rev : Reviews) {
            tempAvg += rev.getNumStars();
        }
        Average_Stars = tempAvg / Reviews.size();
    }
}
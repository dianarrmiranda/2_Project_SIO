package com.shop_backend.models.entities;

import jakarta.persistence.*;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Calendar;
import java.util.Date;

@Entity
public class PasswordResetToken {
    private static final int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne(targetEntity = App_User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private App_User user;

    private Date expiryDate;

    private Date calculateExpiryDate(int expiration) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, expiration);
        return cal.getTime();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public App_User getUser() {
        return user;
    }

    public void setUser(App_User user) {
        this.user = user;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(int expiryDate) {
        this.expiryDate = calculateExpiryDate(expiryDate);
    }

}

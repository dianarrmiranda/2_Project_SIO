package com.shop_backend.models.repos;

import com.shop_backend.models.entities.PasswordResetToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.List;

public interface PasswordResetTokenRepo extends CrudRepository<PasswordResetToken, Integer> {
    PasswordResetToken findByToken(String token);

    List<PasswordResetToken> findAllByExpiryDateBefore(Date now);
}

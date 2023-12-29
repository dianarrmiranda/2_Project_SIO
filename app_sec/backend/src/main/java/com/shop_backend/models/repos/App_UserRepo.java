package com.shop_backend.models.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.shop_backend.models.entities.App_User;

import java.util.List;

public interface App_UserRepo extends CrudRepository<App_User, Integer> {
    @Query(value="SELECT * FROM app_user usr WHERE usr.deleted = false", nativeQuery=true)
    List<App_User> listapp_users();

    @Query(value="SELECT * FROM app_user usr WHERE usr.Role = :type AND usr.deleted = false", nativeQuery=true)
    List<App_User> listapp_usersByType(@Param("type") String type);

    @Query(value="SELECT COUNT(id) FROM app_user usr WHERE usr.deleted = false", nativeQuery=true)
    String getNumberOfapp_users();
    
    @Query(value="SELECT * FROM app_user WHERE id = :id AND deleted = false", nativeQuery=true)
    App_User findapp_userByID(@Param("id") Integer id);
    
    @Query(value="SELECT * FROM app_user WHERE email = :email AND deleted = false", nativeQuery=true)
    App_User findapp_userByEmail(@Param("email") String email);

    @Query(value="SELECT * FROM app_user WHERE email = :email AND password = :pass AND deleted = false", nativeQuery=true)
    App_User findapp_userByEmailAndPassword(@Param("email") String email, @Param("pass") String pass);

    @Modifying
    @Query(value="UPDATE app_user SET deleted = true WHERE id = :id", nativeQuery=true)
    int delapp_user(@Param("id") Integer id);
}
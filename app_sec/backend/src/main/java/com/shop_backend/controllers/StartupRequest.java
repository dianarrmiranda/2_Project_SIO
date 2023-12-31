package com.shop_backend.controllers;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Component
public class StartupRequest {

    //  This class loads after everything else
    @EventListener(ContextRefreshedEvent.class)
    public void runHttpRequest() {

        //  This class sends some initial HTTP requests to create some more complex order histories to a user at startup
        // that are simply to dificult to replicate just by altering the database manually (in the data.sql file) 

        // Create a RestTemplate to make the HTTP request
/*         RestTemplate restTemplate = new RestTemplate();
        String token = "";

        ResponseEntity<String> response = restTemplate.exchange("http://localhost:8080/user/checkLogin?email=jose@fino.com&password=123", HttpMethod.GET, null, String.class);

        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(response.getBody());
            token = root.path("token").asText();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        
        //  Add two items to user 1's shopping cart
        restTemplate.exchange("http://localhost:8080/user/addToCart?userID=2&token=" + token + "&prod=3&quantity=3", HttpMethod.POST, null, String.class);
        restTemplate.exchange("http://localhost:8080/user/addToCart?userID=2&token=" + token + "&prod=11&quantity=1", HttpMethod.POST, null, String.class);
        
        //  Request user 1's cart
        restTemplate.exchange("http://localhost:8080/user/requestCurrentCart?userID=2&token=" + token, HttpMethod.POST, null, String.class);

        //  Add a Review by user 1 to product 11
        restTemplate.exchange("http://localhost:8080/product/addReview?productID=11&userID=2&token=" + token + "&header=Adorei o Produto&description=Completamente mudou a minha vida!&stars=4", HttpMethod.POST, null, String.class);
 */
        return;
    }
}
package com.shop_backend.controllers;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
    .headers((headers) ->
                headers
                    .contentTypeOptions(withDefaults()) //  X-Content-Type-Options: nosniff
                    .xssProtection(withDefaults())      //  X-XSS-Protection header
                    .cacheControl(withDefaults())       //  Cache-Control: no-cache
                    .httpStrictTransportSecurity(withDefaults())  //  Strict Transport Security headers
                    .frameOptions(withDefaults())               
                    .contentSecurityPolicy(cps -> cps.policyDirectives("script-src 'self' ..."))
                    .referrerPolicy(referrerPolicy -> referrerPolicy.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
            )
    .cors(withDefaults())
    .csrf((csrf) -> {
      csrf.ignoringRequestMatchers(new AntPathRequestMatcher("/user/*"));
      csrf.ignoringRequestMatchers(new AntPathRequestMatcher("/product/*"));
    })
    .authorizeHttpRequests((requests) -> {
      /*requests.anyRequest().authenticated()*/
      requests.requestMatchers(new AntPathRequestMatcher("/user/**")).permitAll();
      requests.requestMatchers(new AntPathRequestMatcher("/product/**")).permitAll();
      requests.anyRequest().permitAll(); 
    });
		return http.build();
	}
}
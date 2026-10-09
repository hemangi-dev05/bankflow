package com.bankflow.banking.dto;

import com.bankflow.banking.entity.User;

public class AuthResponse {

    private String token;
    private Long id;
    private String name;
    private String email;
    private String phone;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}
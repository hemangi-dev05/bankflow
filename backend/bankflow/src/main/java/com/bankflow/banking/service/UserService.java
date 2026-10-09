package com.bankflow.banking.service;

import com.bankflow.banking.dto.LoginRequest;
import com.bankflow.banking.dto.ResetPasswordRequest;
import com.bankflow.banking.dto.SignupRequest;
import com.bankflow.banking.entity.User;

public interface UserService {
    User signup(SignupRequest request);
    User login(LoginRequest request);
    User resetPassword(ResetPasswordRequest request);
}
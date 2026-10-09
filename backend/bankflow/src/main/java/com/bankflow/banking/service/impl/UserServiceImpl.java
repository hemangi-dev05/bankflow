package com.bankflow.banking.service.impl;

import com.bankflow.banking.dto.LoginRequest;
import com.bankflow.banking.dto.ResetPasswordRequest;
import com.bankflow.banking.dto.SignupRequest;
import com.bankflow.banking.entity.User;
import com.bankflow.banking.exception.DuplicateEmailException;
import com.bankflow.banking.exception.InvalidCredentialsException;
import com.bankflow.banking.repository.UserRepository;
import com.bankflow.banking.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User signup(SignupRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new DuplicateEmailException("Email already registered!");
        });

        User user = new User(null, request.getName(), request.getEmail(),
                encoder.encode(request.getPassword()), request.getPhone());

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password!"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password!");
        }

        return user;
    }

    @Override
    public User resetPassword(ResetPasswordRequest request) {
        // Same generic message whether the email doesn't exist or the phone
        // doesn't match it — don't let this endpoint be used to probe which
        // emails are registered.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(
                        "We couldn't verify that email and phone number combination."));

        if (!user.getPhone().equals(request.getPhone())) {
            throw new InvalidCredentialsException(
                    "We couldn't verify that email and phone number combination.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        return userRepository.save(user);
    }
}
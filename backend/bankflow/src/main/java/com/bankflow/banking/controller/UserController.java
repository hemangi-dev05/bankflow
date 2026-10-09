package com.bankflow.banking.controller;

import com.bankflow.banking.dto.AuthResponse;
import com.bankflow.banking.dto.LoginRequest;
import com.bankflow.banking.dto.ResetPasswordRequest;
import com.bankflow.banking.dto.SignupRequest;
import com.bankflow.banking.dto.UserResponse;
import com.bankflow.banking.entity.User;
import com.bankflow.banking.exception.InvalidCredentialsException;
import com.bankflow.banking.repository.UserRepository;
import com.bankflow.banking.security.CustomUserDetailsService;
import com.bankflow.banking.security.JwtService;
import com.bankflow.banking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public UserController(UserService userService,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService,
                           CustomUserDetailsService userDetailsService,
                           UserRepository userRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        User user = userService.signup(request);
        return new ResponseEntity<>(UserResponse.fromEntity(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password!"));
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<UserResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userService.resetPassword(request);
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }
}
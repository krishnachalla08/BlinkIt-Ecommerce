package com.blinkit.auth_service.controller;

import com.blinkit.auth_service.dto.AuthResponse;
import com.blinkit.auth_service.dto.LoginRequest;
import com.blinkit.auth_service.dto.RegisterRequest;
import com.blinkit.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping
    public String authHome(){
        return "Auth is running";
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register( @RequestBody RegisterRequest registerRequest){
        authService.register(registerRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login( @RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}

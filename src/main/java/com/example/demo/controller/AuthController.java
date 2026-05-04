package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.example.demo.config.JwtService;
import com.example.demo.model.AuthRequest;
import com.example.demo.model.AuthResponse;
import com.example.demo.model.Admin;
import com.example.demo.model.Employee;
import com.example.demo.model.Customer;
import com.example.demo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Operation(summary = "Register a new customer")
    @PostMapping("/register/customer")
    public String registerCustomer(@Valid @RequestBody Customer customer) {
        return authService.registerCustomer(customer);
    }

    @Operation(summary = "Register a new employee (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/employee")
    public String registerEmployee(@Valid @RequestBody Employee employee) {
        return authService.registerEmployee(employee);
    }

    @Operation(summary = "Register a new admin (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/admin")
    public String registerAdmin(@Valid @RequestBody Admin admin) {
        return authService.registerAdmin(admin);
    }

    @Operation(summary = "Login and get JWT token")
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(authRequest.getEmail());
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return new AuthResponse(token, "Login successful!", role);
        } else {
            throw new UsernameNotFoundException("Invalid credentials!");
        }
    }
}
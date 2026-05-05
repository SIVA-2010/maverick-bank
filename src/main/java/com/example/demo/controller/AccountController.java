package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Account;
import com.example.demo.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/accounts")
@PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Operation(summary = "Get all accounts")
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return new ResponseEntity<>(accountService.getAllAccounts(), HttpStatus.OK);
    }

    @Operation(summary = "Get account by number")
    @GetMapping("/{accountNo}")
    public ResponseEntity<Account> getAccountById(@PathVariable long accountNo) {
        return new ResponseEntity<>(accountService.getAccountById(accountNo), HttpStatus.OK);
    }
}
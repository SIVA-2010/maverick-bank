package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Loan;
import com.example.demo.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/loans")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<Loan> addLoan(@RequestBody Loan loan) {
        Loan saved = loanService.addLoan(loan);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all loan products")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return new ResponseEntity<>(loanService.getAllLoans(), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoanById(@PathVariable String loanId) {
        return new ResponseEntity<>(loanService.getLoanById(loanId), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping
    public ResponseEntity<Loan> updateLoan(@RequestBody Loan loan) {
        Loan updated = loanService.updateLoan(loan);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{loanId}")
    public ResponseEntity<String> deleteLoan(@PathVariable String loanId) {
        String msg = loanService.deleteLoan(loanId);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
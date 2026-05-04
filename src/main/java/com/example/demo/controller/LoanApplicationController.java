package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.LoanApplication;
import com.example.demo.service.LoanApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/loan-applications")
@PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService loanApplicationService;

    @Operation(summary = "Get all loan applications")
    @GetMapping
    public ResponseEntity<List<LoanApplication>> getAllLoanApplications() {
        return new ResponseEntity<>(loanApplicationService.getAllLoanApplications(), HttpStatus.OK);
    }

    @Operation(summary = "Get loan application by ID")
    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplication> getLoanApplicationById(@PathVariable int applicationId) {
        return new ResponseEntity<>(loanApplicationService.getLoanApplicationById(applicationId), HttpStatus.OK);
    }
}
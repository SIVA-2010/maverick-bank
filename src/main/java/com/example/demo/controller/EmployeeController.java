package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.model.LoanApplication;
import com.example.demo.model.Transaction;
import com.example.demo.service.AccountService;
import com.example.demo.service.CustomerService;
import com.example.demo.service.LoanApplicationService;
import com.example.demo.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/employee")
@PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private LoanApplicationService loanApplicationService;

    @Operation(summary = "Get all customers")
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return new ResponseEntity<>(customerService.getAllCustomers(), HttpStatus.OK);
    }

    @Operation(summary = "Get customer by ID")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable int customerId) {
        return new ResponseEntity<>(customerService.getCustomerById(customerId), HttpStatus.OK);
    }

    @Operation(summary = "Get all accounts")
    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        return new ResponseEntity<>(accountService.getAllAccounts(), HttpStatus.OK);
    }

    @Operation(summary = "Get all transactions")
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return new ResponseEntity<>(transactionService.getAllTransactions(), HttpStatus.OK);
    }

    @Operation(summary = "Get all loan applications")
    @GetMapping("/loan-applications")
    public ResponseEntity<List<LoanApplication>> getAllLoanApplications() {
        return new ResponseEntity<>(loanApplicationService.getAllLoanApplications(), HttpStatus.OK);
    }

    @Operation(summary = "Approve loan application")
    @PutMapping("/loan-application/{applicationId}/approve")
    public ResponseEntity<String> approveLoan(@PathVariable int applicationId) {
        try {
            loanApplicationService.updateLoanApplicationStatus(applicationId, "APPROVED");
            return new ResponseEntity<>("Loan Application Approved Successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Reject loan application")
    @PutMapping("/loan-application/{applicationId}/reject")
    public ResponseEntity<String> rejectLoan(@PathVariable int applicationId) {
        try {
            loanApplicationService.updateLoanApplicationStatus(applicationId, "REJECTED");
            return new ResponseEntity<>("Loan Application Rejected Successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Approve account")
    @PutMapping("/account/{accountNo}/approve")
    public ResponseEntity<String> approveAccount(@PathVariable long accountNo) {
        try {
            Account account = accountService.getAccountById(accountNo);
            account.setStatus("ACTIVE");
            accountService.updateAccount(account);
            return new ResponseEntity<>("Account Approved Successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error approving account: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Reject account")
    @PutMapping("/account/{accountNo}/reject")
    public ResponseEntity<String> rejectAccount(@PathVariable long accountNo) {
        try {
            Account account = accountService.getAccountById(accountNo);
            account.setStatus("REJECTED");
            accountService.updateAccount(account);
            return new ResponseEntity<>("Account Rejected Successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error rejecting account: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
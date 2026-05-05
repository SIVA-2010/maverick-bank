package com.example.demo.controller;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.example.demo.model.Account;
import com.example.demo.model.Beneficiary;
import com.example.demo.model.LoanApplication;
import com.example.demo.model.Transaction;
import com.example.demo.service.AccountService;
import com.example.demo.service.BeneficiaryService;
import com.example.demo.service.CustomerService;
import com.example.demo.service.LoanApplicationService;
import com.example.demo.service.TransactionService;
import com.example.demo.service.CustomCustomerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/customer")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private BeneficiaryService beneficiaryService;

    @Autowired
    private LoanApplicationService loanApplicationService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CustomerService customerService;

    private int getCurrentCustomerId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomCustomerDetails) {
            return ((CustomCustomerDetails) principal).getCustomerId();
        }
        return 0;
    }

    @Operation(summary = "Open a new bank account")
    @PostMapping("/open-account")
    public ResponseEntity<Account> openAccount(@Valid @RequestBody Account account) {
        account.setCustomerId(getCurrentCustomerId());
        account.setStatus("PENDING");
        Account savedAccount = accountService.addAccount(account);
        return new ResponseEntity<>(savedAccount, HttpStatus.CREATED);
    }

    @Operation(summary = "Get my accounts")
    @GetMapping("/my-accounts")
    public ResponseEntity<List<Account>> getMyAccounts() {
        int customerId = getCurrentCustomerId();
        List<Account> accounts = customerService.getAccountsByCustomerId(customerId);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @Operation(summary = "Get my beneficiaries")
    @GetMapping("/my-beneficiaries")
    public ResponseEntity<List<Beneficiary>> getMyBeneficiaries() {
        int customerId = getCurrentCustomerId();
        List<Beneficiary> beneficiaries = customerService.getBeneficiariesByCustomerId(customerId);
        return new ResponseEntity<>(beneficiaries, HttpStatus.OK);
    }

    @Operation(summary = "Add beneficiary")
    @PostMapping("/beneficiary")
    public ResponseEntity<Beneficiary> addBeneficiary(@Valid @RequestBody Beneficiary beneficiary) {
        beneficiary.setCustomerId(getCurrentCustomerId());
        Beneficiary saved = beneficiaryService.addBeneficiary(beneficiary);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @Operation(summary = "Apply for loan")
    @PostMapping("/loan-application")
    public ResponseEntity<LoanApplication> applyForLoan(@Valid @RequestBody LoanApplication loanApplication) {
        loanApplication.setCustomerId(getCurrentCustomerId());
        loanApplication.setStatus("PENDING");
        loanApplication.setApplicationDate(new java.util.Date());
        LoanApplication saved = loanApplicationService.addLoanApplication(loanApplication);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @Operation(summary = "Get my loan applications")
    @GetMapping("/my-loan-applications")
    public ResponseEntity<List<LoanApplication>> getMyLoanApplications() {
        int customerId = getCurrentCustomerId();
        List<LoanApplication> applications = customerService.getLoanApplicationsByCustomerId(customerId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @Operation(summary = "Get my transactions")
    @GetMapping("/my-transactions")
    public ResponseEntity<List<Transaction>> getMyTransactions() {
        int customerId = getCurrentCustomerId();
        List<Transaction> transactions = customerService.getTransactionsByCustomerId(customerId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @Operation(summary = "Deposit money")
    @PostMapping("/deposit/{accountNo}/{amount}")
    public ResponseEntity<String> deposit(@PathVariable long accountNo, @PathVariable float amount) {
        Account account = accountService.getAccountById(accountNo);
        if (account.getCustomerId() != getCurrentCustomerId()) {
            return new ResponseEntity<>("Unauthorized: This account does not belong to you", HttpStatus.FORBIDDEN);
        }
        if (!"ACTIVE".equals(account.getStatus())) {
            return new ResponseEntity<>("Account is not active for transactions", HttpStatus.FORBIDDEN);
        }
        if (amount <= 0) {
            return new ResponseEntity<>("Amount must be greater than 0", HttpStatus.BAD_REQUEST);
        }
        float newBalance = account.getBalance() + amount;
        account.setBalance(newBalance);
        accountService.updateAccount(account);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setFromAccountNo(accountNo);
        txn.setToAccountNo(accountNo);
        txn.setAmount(amount);
        txn.setDate(new Date());
        txn.setType("DEPOSIT");
        txn.setDescription("Deposit to account " + accountNo);
        txn.setStatus("SUCCESS");
        transactionService.addTransaction(txn);

        return new ResponseEntity<>("Deposited ₹" + amount + " successfully. New balance: ₹" + newBalance, HttpStatus.OK);
    }

    @Operation(summary = "Withdraw money")
    @PostMapping("/withdraw/{accountNo}/{amount}")
    public ResponseEntity<String> withdraw(@PathVariable long accountNo, @PathVariable float amount) {
        Account account = accountService.getAccountById(accountNo);
        if (account.getCustomerId() != getCurrentCustomerId()) {
            return new ResponseEntity<>("Unauthorized: This account does not belong to you", HttpStatus.FORBIDDEN);
        }
        if (!"ACTIVE".equals(account.getStatus())) {
            return new ResponseEntity<>("Account is not active for transactions", HttpStatus.FORBIDDEN);
        }
        if (amount <= 0) {
            return new ResponseEntity<>("Amount must be greater than 0", HttpStatus.BAD_REQUEST);
        }
        if (account.getBalance() < amount) {
            return new ResponseEntity<>("Insufficient balance!", HttpStatus.BAD_REQUEST);
        }
        float newBalance = account.getBalance() - amount;
        account.setBalance(newBalance);
        accountService.updateAccount(account);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setFromAccountNo(accountNo);
        txn.setToAccountNo(accountNo);
        txn.setAmount(amount);
        txn.setDate(new Date());
        txn.setType("WITHDRAWAL");
        txn.setDescription("Withdrawal from account " + accountNo);
        txn.setStatus("SUCCESS");
        transactionService.addTransaction(txn);

        return new ResponseEntity<>("Withdrawn ₹" + amount + " successfully. New balance: ₹" + newBalance, HttpStatus.OK);
    }

    @Operation(summary = "Transfer money")
    @PostMapping("/transfer/{fromAccount}/{toAccount}/{amount}")
    public ResponseEntity<String> transfer(@PathVariable long fromAccount, @PathVariable long toAccount, @PathVariable float amount) {
        Account fromAcc = accountService.getAccountById(fromAccount);
        Account toAcc = accountService.getAccountById(toAccount);
        
        if (fromAcc.getCustomerId() != getCurrentCustomerId()) {
            return new ResponseEntity<>("Unauthorized: This account does not belong to you", HttpStatus.FORBIDDEN);
        }
        if (!"ACTIVE".equals(fromAcc.getStatus()) || !"ACTIVE".equals(toAcc.getStatus())) {
            return new ResponseEntity<>("One or both accounts are not active for transactions", HttpStatus.FORBIDDEN);
        }
        if (amount <= 0) {
            return new ResponseEntity<>("Amount must be greater than 0", HttpStatus.BAD_REQUEST);
        }
        if (fromAccount == toAccount) {
            return new ResponseEntity<>("Cannot transfer to the same account", HttpStatus.BAD_REQUEST);
        }
        if (fromAcc.getBalance() < amount) {
            return new ResponseEntity<>("Insufficient balance!", HttpStatus.BAD_REQUEST);
        }
        
        float newFromBalance = fromAcc.getBalance() - amount;
        float newToBalance = toAcc.getBalance() + amount;
        
        fromAcc.setBalance(newFromBalance);
        toAcc.setBalance(newToBalance);
        
        accountService.updateAccount(fromAcc);
        accountService.updateAccount(toAcc);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setFromAccountNo(fromAccount);
        txn.setToAccountNo(toAccount);
        txn.setAmount(amount);
        txn.setDate(new Date());
        txn.setType("TRANSFER");
        txn.setDescription("Transfer from " + fromAccount + " to " + toAccount);
        txn.setStatus("SUCCESS");
        transactionService.addTransaction(txn);

        return new ResponseEntity<>("Transferred ₹" + amount + " from account " + fromAccount + " to " + toAccount, HttpStatus.OK);
    }
}
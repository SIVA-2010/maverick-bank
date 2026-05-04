package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Account;
import com.example.demo.repo.AccountRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(long accountNo) {
        return accountRepository.findById(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNo));
    }

    public Account addAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account updateAccount(Account account) {
        if (!accountRepository.existsById(account.getAccountNo())) {
            throw new ResourceNotFoundException("Account not found with number: " + account.getAccountNo());
        }
        return accountRepository.save(account);
    }
}
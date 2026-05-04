package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Account;
import com.example.demo.repo.AccountRepository;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountService accountService;

    private Account account1;
    private Account account2;

    @BeforeEach
    void setUp() {
        account1 = new Account();
        account1.setAccountNo(1001L);
        account1.setAccountName("Siva Savings");
        account1.setType("Savings");
        account1.setBalance(50000);
        account1.setBranchName("Chennai");
        account1.setBranchAddress("123 Anna Salai, Chennai, TN");
        account1.setIfsc("MAVK000CHN1");
        account1.setStatus("ACTIVE");
        account1.setCustomerId(1);

        account2 = new Account();
        account2.setAccountNo(1002L);
        account2.setAccountName("Ravi Business");
        account2.setType("Business");
        account2.setBalance(100000);
        account2.setBranchName("Mumbai");
        account2.setBranchAddress("456 Nariman Point, Mumbai, MH");
        account2.setIfsc("MAVK000MUM2");
        account2.setStatus("PENDING");
        account2.setCustomerId(2);
    }

    @Test
    void testGetAllAccounts() {
        when(accountRepository.findAll()).thenReturn(Arrays.asList(account1, account2));

        List<Account> result = accountService.getAllAccounts();

        assertEquals(2, result.size());
        verify(accountRepository, times(1)).findAll();
    }

    @Test
    void testGetAccountById_Found() {
        when(accountRepository.findById(1001L)).thenReturn(Optional.of(account1));

        Account result = accountService.getAccountById(1001L);

        assertNotNull(result);
        assertEquals("Siva Savings", result.getAccountName());
        assertEquals(50000, result.getBalance());
    }

    @Test
    void testGetAccountById_NotFound() {
        when(accountRepository.findById(9999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            accountService.getAccountById(9999L);
        });
    }

    @Test
    void testAddAccount() {
        when(accountRepository.save(account1)).thenReturn(account1);

        Account result = accountService.addAccount(account1);

        assertNotNull(result);
        assertEquals(1001L, result.getAccountNo());
        assertEquals("ACTIVE", result.getStatus());
        verify(accountRepository, times(1)).save(account1);
    }

    @Test
    void testUpdateAccount_Found() {
        when(accountRepository.existsById(1001L)).thenReturn(true);

        account1.setBalance(75000);
        when(accountRepository.save(account1)).thenReturn(account1);

        Account result = accountService.updateAccount(account1);

        assertEquals(75000, result.getBalance());
        verify(accountRepository, times(1)).save(account1);
    }

    @Test
    void testUpdateAccount_NotFound() {
        when(accountRepository.existsById(9999L)).thenReturn(false);

        Account fakeAccount = new Account();
        fakeAccount.setAccountNo(9999L);

        assertThrows(ResourceNotFoundException.class, () -> {
            accountService.updateAccount(fakeAccount);
        });
    }
}

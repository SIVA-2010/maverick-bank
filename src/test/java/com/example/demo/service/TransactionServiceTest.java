package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Transaction;
import com.example.demo.repo.TransactionRepository;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction depositTxn;
    private Transaction transferTxn;

    @BeforeEach
    void setUp() {
        depositTxn = new Transaction();
        depositTxn.setTransactionId("TXN-DEP-001");
        depositTxn.setFromAccountNo(1001L);
        depositTxn.setToAccountNo(1001L);
        depositTxn.setAmount(5000);
        depositTxn.setDate(new Date());
        depositTxn.setType("DEPOSIT");
        depositTxn.setDescription("Deposit to account 1001");
        depositTxn.setStatus("SUCCESS");

        transferTxn = new Transaction();
        transferTxn.setTransactionId("TXN-TRF-002");
        transferTxn.setFromAccountNo(1001L);
        transferTxn.setToAccountNo(2001L);
        transferTxn.setAmount(3000);
        transferTxn.setDate(new Date());
        transferTxn.setType("TRANSFER");
        transferTxn.setDescription("Transfer from 1001 to 2001");
        transferTxn.setStatus("SUCCESS");
    }

    @Test
    void testGetAllTransactions() {
        when(transactionRepository.findAll()).thenReturn(Arrays.asList(depositTxn, transferTxn));

        List<Transaction> result = transactionService.getAllTransactions();

        assertEquals(2, result.size());
        assertEquals("DEPOSIT", result.get(0).getType());
        assertEquals("TRANSFER", result.get(1).getType());
        verify(transactionRepository, times(1)).findAll();
    }

    @Test
    void testGetTransactionById_Found() {
        when(transactionRepository.findById("TXN-DEP-001")).thenReturn(Optional.of(depositTxn));

        Transaction result = transactionService.getTransactionById("TXN-DEP-001");

        assertNotNull(result);
        assertEquals(5000, result.getAmount());
        assertEquals("DEPOSIT", result.getType());
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void testGetTransactionById_NotFound() {
        when(transactionRepository.findById("FAKE-ID")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.getTransactionById("FAKE-ID");
        });
    }

    @Test
    void testAddTransaction() {
        when(transactionRepository.save(transferTxn)).thenReturn(transferTxn);

        Transaction result = transactionService.addTransaction(transferTxn);

        assertNotNull(result);
        assertEquals("TXN-TRF-002", result.getTransactionId());
        assertEquals(3000, result.getAmount());
        assertEquals(1001L, result.getFromAccountNo());
        assertEquals(2001L, result.getToAccountNo());
        verify(transactionRepository, times(1)).save(transferTxn);
    }

    @Test
    void testGetAllTransactions_EmptyList() {
        when(transactionRepository.findAll()).thenReturn(Arrays.asList());

        List<Transaction> result = transactionService.getAllTransactions();

        assertTrue(result.isEmpty());
        assertEquals(0, result.size());
    }
}

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
import com.example.demo.model.Beneficiary;
import com.example.demo.model.Customer;
import com.example.demo.model.LoanApplication;
import com.example.demo.model.Transaction;
import com.example.demo.repo.AccountRepository;
import com.example.demo.repo.BeneficiaryRepository;
import com.example.demo.repo.CustomerRepository;
import com.example.demo.repo.LoanApplicationRepository;
import com.example.demo.repo.TransactionRepository;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private BeneficiaryRepository beneficiaryRepository;

    @Mock
    private LoanApplicationRepository loanApplicationRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer customer1;
    private Customer customer2;

    @BeforeEach
    void setUp() {
        customer1 = new Customer();
        customer1.setCustomerId(1);
        customer1.setName("Siva");
        customer1.setEmail("siva@test.com");
        customer1.setPhone("9876543210");

        customer2 = new Customer();
        customer2.setCustomerId(2);
        customer2.setName("Ravi");
        customer2.setEmail("ravi@test.com");
        customer2.setPhone("9876543211");
    }

    @Test
    void testGetAllCustomers() {
        when(customerRepository.findAll()).thenReturn(Arrays.asList(customer1, customer2));

        List<Customer> result = customerService.getAllCustomers();

        assertEquals(2, result.size());
        assertEquals("Siva", result.get(0).getName());
        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void testGetCustomerById_Found() {
        when(customerRepository.findById(1)).thenReturn(Optional.of(customer1));

        Customer result = customerService.getCustomerById(1);

        assertNotNull(result);
        assertEquals("Siva", result.getName());
        verify(customerRepository, times(1)).findById(1);
    }

    @Test
    void testGetCustomerById_NotFound() {
        when(customerRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            customerService.getCustomerById(99);
        });
    }

    @Test
    void testGetAccountsByCustomerId() {
        Account acc1 = new Account();
        acc1.setAccountNo(1001L);
        acc1.setCustomerId(1);
        acc1.setType("Savings");

        Account acc2 = new Account();
        acc2.setAccountNo(1002L);
        acc2.setCustomerId(2);
        acc2.setType("Checking");

        Account acc3 = new Account();
        acc3.setAccountNo(1003L);
        acc3.setCustomerId(1);
        acc3.setType("Business");

        when(accountRepository.findAll()).thenReturn(Arrays.asList(acc1, acc2, acc3));

        List<Account> result = customerService.getAccountsByCustomerId(1);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(a -> a.getCustomerId() == 1));
    }

    @Test
    void testGetBeneficiariesByCustomerId() {
        Beneficiary ben1 = new Beneficiary();
        ben1.setBeneficiaryId(1);
        ben1.setCustomerId(1);
        ben1.setAccountName("Friend");

        Beneficiary ben2 = new Beneficiary();
        ben2.setBeneficiaryId(2);
        ben2.setCustomerId(2);
        ben2.setAccountName("Other");

        when(beneficiaryRepository.findAll()).thenReturn(Arrays.asList(ben1, ben2));

        List<Beneficiary> result = customerService.getBeneficiariesByCustomerId(1);

        assertEquals(1, result.size());
        assertEquals("Friend", result.get(0).getAccountName());
    }

    @Test
    void testGetLoanApplicationsByCustomerId() {
        LoanApplication loan1 = new LoanApplication();
        loan1.setApplicationId(1);
        loan1.setCustomerId(1);
        loan1.setStatus("PENDING");

        LoanApplication loan2 = new LoanApplication();
        loan2.setApplicationId(2);
        loan2.setCustomerId(2);
        loan2.setStatus("APPROVED");

        when(loanApplicationRepository.findAll()).thenReturn(Arrays.asList(loan1, loan2));

        List<LoanApplication> result = customerService.getLoanApplicationsByCustomerId(1);

        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
    }

    @Test
    void testGetTransactionsByCustomerId() {
        Account acc = new Account();
        acc.setAccountNo(1001L);
        acc.setCustomerId(1);

        Transaction txn1 = new Transaction();
        txn1.setTransactionId("TXN001");
        txn1.setFromAccountNo(1001L);
        txn1.setToAccountNo(2001L);
        txn1.setAmount(500);

        Transaction txn2 = new Transaction();
        txn2.setTransactionId("TXN002");
        txn2.setFromAccountNo(3001L);
        txn2.setToAccountNo(3002L);
        txn2.setAmount(200);

        when(accountRepository.findAll()).thenReturn(Arrays.asList(acc));
        when(transactionRepository.findAll()).thenReturn(Arrays.asList(txn1, txn2));

        List<Transaction> result = customerService.getTransactionsByCustomerId(1);

        assertEquals(1, result.size());
        assertEquals("TXN001", result.get(0).getTransactionId());
    }
}

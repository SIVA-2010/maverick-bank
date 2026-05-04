package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(int customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }

    public List<Account> getAccountsByCustomerId(int customerId) {
        List<Account> allAccounts = accountRepository.findAll();
        List<Account> customerAccounts = new ArrayList<>();
        for (Account account : allAccounts) {
            if (account.getCustomerId() == customerId) {
                customerAccounts.add(account);
            }
        }
        return customerAccounts;
    }

    public List<Beneficiary> getBeneficiariesByCustomerId(int customerId) {
        List<Beneficiary> allBeneficiaries = beneficiaryRepository.findAll();
        List<Beneficiary> customerBeneficiaries = new ArrayList<>();
        for (Beneficiary beneficiary : allBeneficiaries) {
            if (beneficiary.getCustomerId() == customerId) {
                customerBeneficiaries.add(beneficiary);
            }
        }
        return customerBeneficiaries;
    }

    public List<LoanApplication> getLoanApplicationsByCustomerId(int customerId) {
        List<LoanApplication> allApplications = loanApplicationRepository.findAll();
        List<LoanApplication> customerApplications = new ArrayList<>();
        for (LoanApplication application : allApplications) {
            if (application.getCustomerId() == customerId) {
                customerApplications.add(application);
            }
        }
        return customerApplications;
    }

    public List<Transaction> getTransactionsByCustomerId(int customerId) {
        List<Account> accounts = getAccountsByCustomerId(customerId);
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Transaction> customerTransactions = new ArrayList<>();
        
        for (Transaction transaction : allTransactions) {
            for (Account account : accounts) {
                if (transaction.getFromAccountNo() == account.getAccountNo() ||
                    transaction.getToAccountNo() == account.getAccountNo()) {
                    customerTransactions.add(transaction);
                    break;
                }
            }
        }
        return customerTransactions;
    }
}
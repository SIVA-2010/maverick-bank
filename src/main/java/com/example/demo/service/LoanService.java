package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Loan;
import com.example.demo.repo.LoanRepository;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(String loanId) {
        return loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + loanId));
    }

    public Loan addLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    public Loan updateLoan(Loan loan) {
        if (!loanRepository.existsById(loan.getLoanId())) {
            throw new ResourceNotFoundException("Loan not found with id: " + loan.getLoanId());
        }
        return loanRepository.save(loan);
    }

    public String deleteLoan(String loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + loanId));
        loanRepository.delete(loan);
        return "Loan Record Deleted Successfully";
    }
}
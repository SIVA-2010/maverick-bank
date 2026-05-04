package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.LoanApplication;
import com.example.demo.repo.LoanApplicationRepository;

@Service
public class LoanApplicationService {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    public List<LoanApplication> getAllLoanApplications() {
        return loanApplicationRepository.findAll();
    }

    public LoanApplication getLoanApplicationById(int applicationId) {
        return loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan Application not found with id: " + applicationId));
    }

    public LoanApplication addLoanApplication(LoanApplication loanApplication) {
        return loanApplicationRepository.save(loanApplication);
    }

    public LoanApplication updateLoanApplicationStatus(int applicationId, String status) {
        LoanApplication loanApplication = getLoanApplicationById(applicationId);
        
        if ("APPROVED".equalsIgnoreCase(loanApplication.getStatus()) || "REJECTED".equalsIgnoreCase(loanApplication.getStatus())) {
            throw new IllegalArgumentException("This loan application has already been processed!");
        }
        
        loanApplication.setStatus(status);
        if ("APPROVED".equalsIgnoreCase(status)) {
            loanApplication.setApprovalDate(new java.util.Date());
        }
        return loanApplicationRepository.save(loanApplication);
    }
}
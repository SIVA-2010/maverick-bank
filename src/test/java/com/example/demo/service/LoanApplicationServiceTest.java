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
import com.example.demo.model.LoanApplication;
import com.example.demo.repo.LoanApplicationRepository;

@ExtendWith(MockitoExtension.class)
public class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository loanApplicationRepository;

    @InjectMocks
    private LoanApplicationService loanApplicationService;

    private LoanApplication pendingLoan;
    private LoanApplication approvedLoan;

    @BeforeEach
    void setUp() {
        pendingLoan = new LoanApplication();
        pendingLoan.setApplicationId(1);
        pendingLoan.setCustomerId(1);
        pendingLoan.setLoanId("L001");
        pendingLoan.setRequestedAmount(500000);
        pendingLoan.setPurpose("Home renovation");
        pendingLoan.setStatus("PENDING");
        pendingLoan.setApplicationDate(new Date());

        approvedLoan = new LoanApplication();
        approvedLoan.setApplicationId(2);
        approvedLoan.setCustomerId(2);
        approvedLoan.setLoanId("L003");
        approvedLoan.setRequestedAmount(100000);
        approvedLoan.setPurpose("Personal expenses");
        approvedLoan.setStatus("APPROVED");
        approvedLoan.setApplicationDate(new Date());
        approvedLoan.setApprovalDate(new Date());
    }

    @Test
    void testGetAllLoanApplications() {
        when(loanApplicationRepository.findAll()).thenReturn(Arrays.asList(pendingLoan, approvedLoan));

        List<LoanApplication> result = loanApplicationService.getAllLoanApplications();

        assertEquals(2, result.size());
        verify(loanApplicationRepository, times(1)).findAll();
    }

    @Test
    void testGetLoanApplicationById_Found() {
        when(loanApplicationRepository.findById(1)).thenReturn(Optional.of(pendingLoan));

        LoanApplication result = loanApplicationService.getLoanApplicationById(1);

        assertNotNull(result);
        assertEquals("Home renovation", result.getPurpose());
        assertEquals("PENDING", result.getStatus());
    }

    @Test
    void testGetLoanApplicationById_NotFound() {
        when(loanApplicationRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            loanApplicationService.getLoanApplicationById(99);
        });
    }

    @Test
    void testAddLoanApplication() {
        when(loanApplicationRepository.save(pendingLoan)).thenReturn(pendingLoan);

        LoanApplication result = loanApplicationService.addLoanApplication(pendingLoan);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(500000, result.getRequestedAmount());
        verify(loanApplicationRepository, times(1)).save(pendingLoan);
    }

    @Test
    void testUpdateLoanApplicationStatus_ApprovePending() {
        when(loanApplicationRepository.findById(1)).thenReturn(Optional.of(pendingLoan));
        when(loanApplicationRepository.save(any(LoanApplication.class))).thenReturn(pendingLoan);

        LoanApplication result = loanApplicationService.updateLoanApplicationStatus(1, "APPROVED");

        assertEquals("APPROVED", result.getStatus());
        assertNotNull(result.getApprovalDate());
        verify(loanApplicationRepository, times(1)).save(any(LoanApplication.class));
    }

    @Test
    void testUpdateLoanApplicationStatus_RejectPending() {
        when(loanApplicationRepository.findById(1)).thenReturn(Optional.of(pendingLoan));
        when(loanApplicationRepository.save(any(LoanApplication.class))).thenReturn(pendingLoan);

        LoanApplication result = loanApplicationService.updateLoanApplicationStatus(1, "REJECTED");

        assertEquals("REJECTED", result.getStatus());
        assertNull(result.getApprovalDate()); // No approval date for rejections
    }

    @Test
    void testUpdateLoanApplicationStatus_AlreadyProcessed() {
        when(loanApplicationRepository.findById(2)).thenReturn(Optional.of(approvedLoan));

        assertThrows(IllegalArgumentException.class, () -> {
            loanApplicationService.updateLoanApplicationStatus(2, "REJECTED");
        });

        // Verify save was never called since the loan was already processed
        verify(loanApplicationRepository, never()).save(any(LoanApplication.class));
    }
}

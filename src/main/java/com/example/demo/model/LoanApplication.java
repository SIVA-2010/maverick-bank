package com.example.demo.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loan_application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int applicationId;
    private int customerId;
    private String loanId;
    private float requestedAmount;
    private String purpose;
    @Temporal(TemporalType.DATE)
    private Date applicationDate;
    private String status;
    @Temporal(TemporalType.DATE)
    private Date approvalDate;
    private String rejectionReason;
 
    @Column(nullable = true) 
    private Integer approvedByEmployeeId;
}
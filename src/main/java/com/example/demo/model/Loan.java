package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    @Id
    private String loanId;
    private String loanType;
    private float amount;
    private float interestRate;
    private int tenure;
    private String eligibilityCriteria;
    private String status;
}
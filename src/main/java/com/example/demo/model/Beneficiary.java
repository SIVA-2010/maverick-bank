package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "beneficiary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Beneficiary {
    @Id
    private int beneficiaryId;
    private int customerId;
    private String accountName;
    private String accountNumber;
    private String bankName;
    private String branchName;
    private String ifscCode;
}
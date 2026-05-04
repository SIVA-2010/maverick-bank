package com.example.demo.model;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private long accountNo;
    private String accountName;
    @NotBlank(message = "Account Type is required")
    private String type;
    @Min(value = 0, message = "Balance cannot be negative")
    private float balance;
    @NotBlank(message = "Branch Name is required")
    private String branchName;
    @NotBlank(message = "Branch Address is required")
    private String branchAddress;
    private String ifsc;
    @Temporal(TemporalType.DATE)
    private Date openingDate;
    private String status;
    private int customerId;
}
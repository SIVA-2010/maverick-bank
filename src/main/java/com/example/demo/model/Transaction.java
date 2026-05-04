package com.example.demo.model;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    private String transactionId;
    private long fromAccountNo;
    private long toAccountNo;
    
    @Min(value = 1, message = "Transaction amount must be strictly greater than 0")
    private float amount;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    private String type;
    private String description;
    private String status;
}
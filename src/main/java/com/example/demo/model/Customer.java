package com.example.demo.model;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @Column(name = "customer_id")
    private int customerId;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String gender;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth")
    private Date dateOfBirth;
    
    private int age;
    
    @Column(name = "aadhar_number")
    private String aadharNumber;
    
    @Column(name = "pan_number")
    private String panNumber;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String address;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private String roles;
}
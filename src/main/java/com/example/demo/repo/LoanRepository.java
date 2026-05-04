package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Loan;

@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
}
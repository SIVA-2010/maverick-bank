package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Beneficiary;
import com.example.demo.repo.BeneficiaryRepository;

@Service
public class BeneficiaryService {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    public List<Beneficiary> getAllBeneficiaries() {
        return beneficiaryRepository.findAll();
    }

    public Beneficiary getBeneficiaryById(int beneficiaryId) {
        return beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + beneficiaryId));
    }

    public Beneficiary addBeneficiary(Beneficiary beneficiary) {
        return beneficiaryRepository.save(beneficiary);
    }

    public Beneficiary updateBeneficiary(Beneficiary beneficiary) {
        if (!beneficiaryRepository.existsById(beneficiary.getBeneficiaryId())) {
            throw new ResourceNotFoundException("Beneficiary not found with id: " + beneficiary.getBeneficiaryId());
        }
        return beneficiaryRepository.save(beneficiary);
    }

    public String deleteBeneficiary(int beneficiaryId) {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + beneficiaryId));
        beneficiaryRepository.delete(beneficiary);
        return "Beneficiary deleted successfully!";
    }
}
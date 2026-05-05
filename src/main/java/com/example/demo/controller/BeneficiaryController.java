package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Beneficiary;
import com.example.demo.service.BeneficiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/beneficiary")
@PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "*")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<Beneficiary> addBeneficiary(@RequestBody Beneficiary beneficiary) {
        Beneficiary saved = beneficiaryService.addBeneficiary(beneficiary);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Beneficiary>> getAllBeneficiaries() {
        return new ResponseEntity<>(beneficiaryService.getAllBeneficiaries(), HttpStatus.OK);
    }

    @GetMapping("/{beneficiaryId}")
    public ResponseEntity<Beneficiary> getBeneficiaryById(@PathVariable int beneficiaryId) {
        return new ResponseEntity<>(beneficiaryService.getBeneficiaryById(beneficiaryId), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Beneficiary> updateBeneficiary(@RequestBody Beneficiary beneficiary) {
        Beneficiary updated = beneficiaryService.updateBeneficiary(beneficiary);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{beneficiaryId}")
    public ResponseEntity<String> deleteBeneficiary(@PathVariable int beneficiaryId) {
        String msg = beneficiaryService.deleteBeneficiary(beneficiaryId);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
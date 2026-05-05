package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Admin;
import com.example.demo.model.Employee;
import com.example.demo.service.AdminService;
import com.example.demo.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private EmployeeService employeeService;

    @Operation(summary = "Get all admins")
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return new ResponseEntity<>(adminService.getAllAdmins(), HttpStatus.OK);
    }

    @Operation(summary = "Get all employees")
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return new ResponseEntity<>(employeeService.getAllEmployees(), HttpStatus.OK);
    }

    @Operation(summary = "Delete employee")
    @DeleteMapping("/employee/{emplId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int emplId) {
        String msg = employeeService.deleteEmployee(emplId);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @Operation(summary = "Delete admin")
    @DeleteMapping("/admin/{adminId}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int adminId) {
        String msg = adminService.deleteAdmin(adminId);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
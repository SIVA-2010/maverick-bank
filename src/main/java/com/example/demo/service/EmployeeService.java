package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Employee;
import com.example.demo.repo.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(int emplId) {
        return employeeRepository.findById(emplId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + emplId));
    }

    public String deleteEmployee(int emplId) {
        Employee employee = employeeRepository.findById(emplId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + emplId));
        employeeRepository.delete(employee);
        return "Employee deleted successfully!";
    }
}
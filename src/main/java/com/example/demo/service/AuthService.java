package com.example.demo.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.model.Admin;
import com.example.demo.model.Employee;
import com.example.demo.model.Customer;
import com.example.demo.repo.AdminRepository;
import com.example.demo.repo.EmployeeRepository;
import com.example.demo.repo.CustomerRepository;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            System.out.println("Loading ADMIN: " + email);
            return new CustomAdminDetails(admin.get());
        }

        Optional<Employee> employee = employeeRepository.findByEmail(email);
        if (employee.isPresent()) {
            System.out.println("Loading EMPLOYEE: " + email);
            return new CustomEmployeeDetails(employee.get());
        }

        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isPresent()) {
            System.out.println("Loading CUSTOMER: " + email);
            return new CustomCustomerDetails(customer.get());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }

    public String registerCustomer(Customer customer) {
        // Check if email already exists
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return "Email already registered!";
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setRoles("ROLE_CUSTOMER");
        customerRepository.save(customer);
        return "Customer registered successfully!";
    }

    public String registerEmployee(Employee employee) {
        // Check if email already exists
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            return "Email already registered!";
        }
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setRoles("ROLE_EMPLOYEE");
        employeeRepository.save(employee);
        return "Employee registered successfully!";
    }

    public String registerAdmin(Admin admin) {
        // Check if email already exists
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            return "Email already registered!";
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRoles("ROLE_ADMIN");
        adminRepository.save(admin);
        return "Admin registered successfully!";
    }
}
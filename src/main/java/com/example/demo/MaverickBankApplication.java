package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MaverickBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaverickBankApplication.class, args);
        System.out.println("Maverick Bank Started on port 5000");
        System.out.println("Registered with Eureka Server");
    }
}
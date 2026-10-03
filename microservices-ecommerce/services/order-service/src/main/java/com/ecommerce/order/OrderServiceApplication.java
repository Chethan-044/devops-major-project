package com.ecommerce.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@SpringBootApplication
@RestController
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(
            OrderServiceApplication.class,
            args
        );
    }

    @Bean
    public RestClient restClient() {
        return RestClient.builder().build();
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}
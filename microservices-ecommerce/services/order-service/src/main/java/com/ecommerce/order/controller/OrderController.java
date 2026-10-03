package com.ecommerce.order.controller;

import com.ecommerce.order.model.CreateOrderRequest;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrders() {

        return orderService.getOrders();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request
    ) {

        Order order =
            orderService.createOrder(request);

        return ResponseEntity
            .status(201)
            .body(order);
    }
}
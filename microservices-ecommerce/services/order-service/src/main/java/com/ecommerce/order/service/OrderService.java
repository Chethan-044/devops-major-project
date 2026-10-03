package com.ecommerce.order.service;

import com.ecommerce.order.model.CreateOrderRequest;
import com.ecommerce.order.model.Order;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;

@Service
public class OrderService {

    private final RestClient restClient;

    @Value("${services.user.url:http://localhost:8001}")
    private String userServiceUrl;

    @Value("${services.product.url:http://localhost:8002}")
    private String productServiceUrl;

    @Value("${services.storage.url:http://localhost:8004}")
    private String storageServiceUrl;

    public OrderService(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<Order> getOrders() {

        Order[] orders = restClient.get()
            .uri(storageServiceUrl + "/api/storage/orders")
            .retrieve()
            .body(Order[].class);

        if (orders == null) {
            return List.of();
        }

        return Arrays.asList(orders);
    }

    public Order createOrder(CreateOrderRequest request) {

        if (request.getUserId() == null) {
            throw new IllegalArgumentException(
                "User ID is required"
            );
        }

        if (request.getProductId() == null) {
            throw new IllegalArgumentException(
                "Product ID is required"
            );
        }

        if (request.getQuantity() == null ||
            request.getQuantity() <= 0) {

            throw new IllegalArgumentException(
                "Quantity must be greater than zero"
            );
        }

        /*
         * Ask User Service whether the user exists.
         */
        String userUrl =
            userServiceUrl +
            "/api/users/" +
            request.getUserId();

        restClient.get()
            .uri(userUrl)
            .retrieve()
            .onStatus(
                HttpStatusCode::isError,
                (req, response) -> {
                    throw new RuntimeException(
                        "User does not exist"
                    );
                }
            )
            .toBodilessEntity();


        /*
         * Ask Product Service for product information.
         */
        String productUrl =
            productServiceUrl +
            "/api/products/" +
            request.getProductId();

        ProductResponse product =
            restClient.get()
                .uri(productUrl)
                .retrieve()
                .onStatus(
                    HttpStatusCode::isError,
                    (req, response) -> {
                        throw new RuntimeException(
                            "Product does not exist"
                        );
                    }
                )
                .body(ProductResponse.class);


        if (product == null || product.price() == null) {
            throw new RuntimeException(
                "Product information unavailable"
            );
        }

        double totalPrice =
            product.price() * request.getQuantity();


        /*
         * Create the order through Storage Service.
         */
        CreateStorageOrderRequest storageRequest =
            new CreateStorageOrderRequest(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity(),
                totalPrice
            );

        return restClient.post()
            .uri(storageServiceUrl + "/api/storage/orders")
            .body(storageRequest)
            .retrieve()
            .onStatus(
                HttpStatusCode::isError,
                (req, response) -> {
                    throw new RuntimeException(
                        "Storage Service failed to create order"
                    );
                }
            )
            .body(Order.class);
    }

    private record ProductResponse(
        Integer id,
        String name,
        String description,
        Double price
    ) {
    }

    private record CreateStorageOrderRequest(
        Integer userId,
        Integer productId,
        Integer quantity,
        Double totalPrice
    ) {
    }
}
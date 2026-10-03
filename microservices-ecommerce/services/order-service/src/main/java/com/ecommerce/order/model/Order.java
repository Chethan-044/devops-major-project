package com.ecommerce.order.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Order {

    private Long id;

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("product_id")
    private Integer productId;

    private Integer quantity;

    @JsonProperty("total_price")
    private Double totalPrice;

    public Order() {
    }

    public Order(
            Long id,
            Integer userId,
            Integer productId,
            Integer quantity,
            Double totalPrice
    ) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getProductId() {
        return productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }
}
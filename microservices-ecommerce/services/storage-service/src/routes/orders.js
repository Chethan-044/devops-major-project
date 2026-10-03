const express = require("express");

const {
    getAllOrders,
    getOrderById,
    createOrder
} = require("../repositories/orderRepository");

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const orders =
            await getAllOrders();

        res.json(orders);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve orders"
        });
    }
});

router.get("/:id", async (req, res) => {

    try {

        const order =
            await getOrderById(req.params.id);

        if (!order) {

            return res.status(404).json({
                error: "Order not found"
            });
        }

        res.json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve order"
        });
    }
});

router.post("/", async (req, res) => {

    try {

        const {
            userId,
            productId,
            quantity,
            totalPrice
        } = req.body;

        if (
            !userId ||
            !productId ||
            !quantity ||
            totalPrice === undefined
        ) {

            return res.status(400).json({
                error:
                    "userId, productId, quantity and totalPrice are required"
            });
        }

        const order =
            await createOrder(
                userId,
                productId,
                quantity,
                totalPrice
            );

        res.status(201).json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create order"
        });
    }
});

module.exports = router;

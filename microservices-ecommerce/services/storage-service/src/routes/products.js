const express = require("express");

const {
    getAllProducts,
    getProductById,
    createProduct
} = require("../repositories/productRepository");

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const products =
            await getAllProducts();

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve products"
        });
    }
});

router.get("/:id", async (req, res) => {

    try {

        const product =
            await getProductById(req.params.id);

        if (!product) {

            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve product"
        });
    }
});

router.post("/", async (req, res) => {

    try {

        const {
            name,
            description,
            price
        } = req.body;

        if (!name || price === undefined) {

            return res.status(400).json({
                error: "name and price are required"
            });
        }

        const product =
            await createProduct(
                name,
                description || "",
                price
            );

        res.status(201).json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create product"
        });
    }
});

module.exports = router;

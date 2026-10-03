const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "storage-service"
    });
});

app.use("/api/storage/users", userRoutes);
app.use("/api/storage/products", productRoutes);
app.use("/api/storage/orders", orderRoutes);

const PORT = process.env.PORT || 8004;

app.listen(PORT, () => {
    console.log(
        `Storage Service running on port ${PORT}`
    );
});

const pool = require("../db");


async function getAllOrders() {

    const result = await pool.query(`
        SELECT
            id,
            user_id,
            product_id,
            quantity,
            total_price,
            status,
            created_at
        FROM orders
        ORDER BY id DESC
    `);

    return result.rows.map(order => ({
        ...order,
        total_price: Number(order.total_price)
    }));
}


async function getOrderById(id) {

    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            product_id,
            quantity,
            total_price,
            status,
            created_at
        FROM orders
        WHERE id = $1
        `,
        [id]
    );

    if (!result.rows[0]) {
        return undefined;
    }

    return {
        ...result.rows[0],
        total_price: Number(result.rows[0].total_price)
    };
}


async function createOrder(
    userId,
    productId,
    quantity,
    totalPrice
) {

    const result = await pool.query(
        `
        INSERT INTO orders
        (
            user_id,
            product_id,
            quantity,
            total_price,
            status
        )
        VALUES ($1, $2, $3, $4, 'CREATED')
        RETURNING
            id,
            user_id,
            product_id,
            quantity,
            total_price,
            status,
            created_at
        `,
        [
            userId,
            productId,
            quantity,
            totalPrice
        ]
    );

    return {
        ...result.rows[0],
        total_price: Number(result.rows[0].total_price)
    };
}


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder
};
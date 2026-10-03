const pool = require("../db");


async function getAllProducts() {

    const result = await pool.query(`
        SELECT id, name, description, price, created_at
        FROM products
        ORDER BY id
    `);

    return result.rows.map(product => ({
        ...product,
        price: Number(product.price)
    }));
}


async function getProductById(id) {

    const result = await pool.query(
        `
        SELECT id, name, description, price, created_at
        FROM products
        WHERE id = $1
        `,
        [id]
    );

    if (!result.rows[0]) {
        return undefined;
    }

    return {
        ...result.rows[0],
        price: Number(result.rows[0].price)
    };
}


async function createProduct(
    name,
    description,
    price
) {

    const result = await pool.query(
        `
        INSERT INTO products
        (name, description, price)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, price, created_at
        `,
        [name, description, price]
    );

    return {
        ...result.rows[0],
        price: Number(result.rows[0].price)
    };
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct
};
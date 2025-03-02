const db = require('../config/db');

const getAllProducts = async () => {
    const query = 'SELECT * FROM product';
    const [rows] = await db.query(query);
    return rows;
};

const getProductById = async (id) => {
    const query = 'SELECT * FROM product WHERE product_id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const createProduct = async (product) => {
    const query = 'INSERT INTO product SET ?';
    const [result] = await db.query(query, product);
    return result.insertId;
};

const updateProduct = async (id, product) => {
    const query = 'UPDATE product SET ? WHERE product_id = ?';
    await db.query(query, [product, id]);
};

const deleteProduct = async (id) => {
    const query = 'DELETE FROM product WHERE product_id = ?';
    await db.query(query, [id]);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
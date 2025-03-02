const db = require('../config/db');

const getAllCustomers = async () => {
    const query = 'SELECT * FROM customer';
    const [rows] = await db.query(query);
    return rows;
};

const getCustomerById = async (id) => {
    const query = 'SELECT * FROM customer WHERE customer_id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const createCustomer = async (customer) => {
    const query = 'INSERT INTO customer SET ?';
    const [result] = await db.query(query, customer);
    return result.insertId;
};

const updateCustomer = async (id, customer) => {
    const query = 'UPDATE customer SET ? WHERE customer_id = ?';
    await db.query(query, [customer, id]);
};

const deleteCustomer = async (id) => {
    const query = 'DELETE FROM customer WHERE customer_id = ?';
    await db.query(query, [id]);
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
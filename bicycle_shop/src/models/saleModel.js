const db = require('../config/db');

const getAllSales = async () => {
    const query = 'SELECT * FROM sale';
    const [rows] = await db.query(query);
    return rows;
};

const getSaleById = async (id) => {
    const query = 'SELECT * FROM sale WHERE sale_id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const createSale = async (sale) => {
    const query = 'INSERT INTO sale SET ?';
    const [result] = await db.query(query, sale);
    return result.insertId;
};

const updateSale = async (id, sale) => {
    const query = 'UPDATE sale SET ? WHERE sale_id = ?';
    await db.query(query, [sale, id]);
};

const deleteSale = async (id) => {
    const query = 'DELETE FROM sale WHERE sale_id = ?';
    await db.query(query, [id]);
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
};
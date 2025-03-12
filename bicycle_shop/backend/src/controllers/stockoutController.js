const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllStockouts = async (req, res) => {
    try {
        const stockouts = await sequelize.query(
            `SELECT * FROM stockout`,
            { type: QueryTypes.SELECT }
        );
        res.json(stockouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStockoutById = async (req, res) => {
    try {
        const stockout = await sequelize.query(
            `SELECT * FROM stockout WHERE stockout_id = :stockout_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { stockout_id: req.params.id }
            }
        );

        if (stockout.length > 0) {
            res.json(stockout[0]);
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStockout = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO stockout (product_id, quantity, remarks, stockout_date, reason, sale_attendant, manager)
             VALUES (:product_id, :quantity, :remarks, :stockout_date, :reason, :sale_attendant, :manager)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    product_id: req.body.product_id,
                    quantity: req.body.quantity || null,
                    remarks: req.body.remarks || null,
                    stockout_date: req.body.stockout_date,
                    reason: req.body.reason,
                    sale_attendant: req.body.sale_attendant,
                    manager: req.body.manager
                }
            }
        );

        res.status(201).json({ message: 'Stockout created successfully', stockout_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStockout = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE stockout SET 
                product_id = :product_id,
                quantity = :quantity,
                remarks = :remarks,
                stockout_date = :stockout_date,
                reason = :reason,
                sale_attendant = :sale_attendant,
                manager = :manager
             WHERE stockout_id = :stockout_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    product_id: req.body.product_id,
                    quantity: req.body.quantity || null,
                    remarks: req.body.remarks || null,
                    stockout_date: req.body.stockout_date,
                    reason: req.body.reason,
                    sale_attendant: req.body.sale_attendant,
                    manager: req.body.manager,
                    stockout_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedStockout = await sequelize.query(
                `SELECT * FROM stockout WHERE stockout_id = :stockout_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { stockout_id: req.params.id }
                }
            );
            res.json(updatedStockout[0]);
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStockout = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM stockout WHERE stockout_id = :stockout_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { stockout_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

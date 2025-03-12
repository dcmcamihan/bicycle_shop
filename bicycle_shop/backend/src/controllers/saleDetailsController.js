const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSaleDetails = async (req, res) => {
    try {
        const saleDetails = await sequelize.query(
            `SELECT * FROM sale_details`,
            { type: QueryTypes.SELECT }
        );
        res.json(saleDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleDetailsById = async (req, res) => {
    try {
        const saleDetails = await sequelize.query(
            `SELECT * FROM sale_details WHERE sale_detail_id = :sale_detail_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { sale_detail_id: req.params.id }
            }
        );

        if (saleDetails.length > 0) {
            res.json(saleDetails[0]);
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSaleDetails = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO sale_details (sale_id, product_id, quantity_sold)
             VALUES (:sale_id, :product_id, :quantity_sold)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    sale_id: req.body.sale_id,
                    product_id: req.body.product_id,
                    quantity_sold: req.body.quantity_sold
                }
            }
        );

        res.status(201).json({ message: 'Sale details created successfully', sale_detail_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSaleDetails = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE sale_details SET 
                sale_id = :sale_id,
                product_id = :product_id,
                quantity_sold = :quantity_sold
             WHERE sale_detail_id = :sale_detail_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    sale_id: req.body.sale_id,
                    product_id: req.body.product_id,
                    quantity_sold: req.body.quantity_sold,
                    sale_detail_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSaleDetails = await sequelize.query(
                `SELECT * FROM sale_details WHERE sale_detail_id = :sale_detail_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { sale_detail_id: req.params.id }
                }
            );
            res.json(updatedSaleDetails[0]);
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSaleDetails = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM sale_details WHERE sale_detail_id = :sale_detail_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { sale_detail_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

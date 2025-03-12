const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSupplyDetails = async (req, res) => {
    try {
        const supplyDetails = await sequelize.query(
            `SELECT * FROM supply_details`,
            { type: QueryTypes.SELECT }
        );
        res.json(supplyDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplyDetailsById = async (req, res) => {
    try {
        const supplyDetails = await sequelize.query(
            `SELECT * FROM supply_details WHERE supply_details_id = :supply_details_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { supply_details_id: req.params.id }
            }
        );

        if (supplyDetails.length > 0) {
            res.json(supplyDetails[0]);
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplyDetails = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO supply_details (supply_id, product_id, quantity_supplied)
             VALUES (:supply_id, :product_id, :quantity_supplied)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    supply_id: req.body.supply_id,
                    product_id: req.body.product_id,
                    quantity_supplied: req.body.quantity_supplied || 0
                }
            }
        );

        res.status(201).json({ message: 'Supply details created successfully', supply_details_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplyDetails = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE supply_details SET 
                supply_id = :supply_id,
                product_id = :product_id,
                quantity_supplied = :quantity_supplied
             WHERE supply_details_id = :supply_details_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    supply_id: req.body.supply_id,
                    product_id: req.body.product_id,
                    quantity_supplied: req.body.quantity_supplied || 0,
                    supply_details_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSupplyDetails = await sequelize.query(
                `SELECT * FROM supply_details WHERE supply_details_id = :supply_details_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { supply_details_id: req.params.id }
                }
            );
            res.json(updatedSupplyDetails[0]);
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplyDetails = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM supply_details WHERE supply_details_id = :supply_details_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { supply_details_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

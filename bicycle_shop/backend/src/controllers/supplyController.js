const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSupplies = async (req, res) => {
    try {
        const supplies = await sequelize.query(
            `SELECT * FROM supply`,
            { type: QueryTypes.SELECT }
        );
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplyById = async (req, res) => {
    try {
        const supply = await sequelize.query(
            `SELECT * FROM supply WHERE supply_id = :supply_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { supply_id: req.params.id }
            }
        );

        if (supply.length > 0) {
            res.json(supply[0]);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupply = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO supply (supplier_id, supply_date, payment_method_code, sale_attendant, manager)
             VALUES (:supplier_id, :supply_date, :payment_method_code, :sale_attendant, :manager)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    supplier_id: req.body.supplier_id,
                    supply_date: req.body.supply_date,
                    payment_method_code: req.body.payment_method_code,
                    sale_attendant: req.body.sale_attendant,
                    manager: req.body.manager
                }
            }
        );

        res.status(201).json({ message: 'Supply created successfully', supply_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupply = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE supply SET 
                supplier_id = :supplier_id,
                supply_date = :supply_date,
                payment_method_code = :payment_method_code,
                sale_attendant = :sale_attendant,
                manager = :manager
             WHERE supply_id = :supply_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    supplier_id: req.body.supplier_id,
                    supply_date: req.body.supply_date,
                    payment_method_code: req.body.payment_method_code,
                    sale_attendant: req.body.sale_attendant,
                    manager: req.body.manager,
                    supply_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSupply = await sequelize.query(
                `SELECT * FROM supply WHERE supply_id = :supply_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { supply_id: req.params.id }
                }
            );
            res.json(updatedSupply[0]);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupply = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM supply WHERE supply_id = :supply_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { supply_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

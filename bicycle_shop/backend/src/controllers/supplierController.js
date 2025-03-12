const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await sequelize.query(
            `SELECT * FROM supplier`,
            { type: QueryTypes.SELECT }
        );
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await sequelize.query(
            `SELECT * FROM supplier WHERE supplier_id = :supplier_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { supplier_id: req.params.id }
            }
        );

        if (supplier.length > 0) {
            res.json(supplier[0]);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO supplier (supplier_name)
             VALUES (:supplier_name)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    supplier_name: req.body.supplier_name
                }
            }
        );

        res.status(201).json({ message: 'Supplier created successfully', supplier_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE supplier SET 
                supplier_name = :supplier_name
             WHERE supplier_id = :supplier_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    supplier_name: req.body.supplier_name,
                    supplier_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSupplier = await sequelize.query(
                `SELECT * FROM supplier WHERE supplier_id = :supplier_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { supplier_id: req.params.id }
                }
            );
            res.json(updatedSupplier[0]);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM supplier WHERE supplier_id = :supplier_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { supplier_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSupplierAddresses = async (req, res) => {
    try {
        const supplierAddresses = await sequelize.query(
            `SELECT * FROM supplier_address`,
            { type: QueryTypes.SELECT }
        );
        res.json(supplierAddresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierAddressById = async (req, res) => {
    try {
        const supplierAddress = await sequelize.query(
            `SELECT * FROM supplier_address WHERE supplier_address_id = :supplier_address_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { supplier_address_id: req.params.id }
            }
        );

        if (supplierAddress.length > 0) {
            res.json(supplierAddress[0]);
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplierAddress = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO supplier_address (supplier_id, country, zip_code, province, city, barangay, street)
             VALUES (:supplier_id, :country, :zip_code, :province, :city, :barangay, :street)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    supplier_id: req.body.supplier_id,
                    country: req.body.country,
                    zip_code: req.body.zip_code,
                    province: req.body.province,
                    city: req.body.city,
                    barangay: req.body.barangay || null,
                    street: req.body.street || null
                }
            }
        );

        res.status(201).json({ message: 'Supplier address created successfully', supplier_address_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplierAddress = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE supplier_address SET 
                supplier_id = :supplier_id,
                country = :country,
                zip_code = :zip_code,
                province = :province,
                city = :city,
                barangay = :barangay,
                street = :street
             WHERE supplier_address_id = :supplier_address_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    supplier_id: req.body.supplier_id,
                    country: req.body.country,
                    zip_code: req.body.zip_code,
                    province: req.body.province,
                    city: req.body.city,
                    barangay: req.body.barangay || null,
                    street: req.body.street || null,
                    supplier_address_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSupplierAddress = await sequelize.query(
                `SELECT * FROM supplier_address WHERE supplier_address_id = :supplier_address_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { supplier_address_id: req.params.id }
                }
            );
            res.json(updatedSupplierAddress[0]);
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplierAddress = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM supplier_address WHERE supplier_address_id = :supplier_address_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { supplier_address_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

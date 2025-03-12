const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSupplierContacts = async (req, res) => {
    try {
        const supplierContacts = await sequelize.query(
            `SELECT * FROM supplier_contact`,
            { type: QueryTypes.SELECT }
        );
        res.json(supplierContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierContactById = async (req, res) => {
    try {
        const supplierContact = await sequelize.query(
            `SELECT * FROM supplier_contact WHERE supplier_contact_id = :supplier_contact_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { supplier_contact_id: req.params.id }
            }
        );

        if (supplierContact.length > 0) {
            res.json(supplierContact[0]);
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplierContact = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO supplier_contact (contact_type_code, supplier_id, contact_value, is_active, is_primary)
             VALUES (:contact_type_code, :supplier_id, :contact_value, :is_active, :is_primary)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    contact_type_code: req.body.contact_type_code,
                    supplier_id: req.body.supplier_id,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y'
                }
            }
        );

        res.status(201).json({ message: 'Supplier contact created successfully', supplier_contact_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplierContact = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE supplier_contact SET 
                contact_type_code = :contact_type_code,
                supplier_id = :supplier_id,
                contact_value = :contact_value,
                is_active = :is_active,
                is_primary = :is_primary
             WHERE supplier_contact_id = :supplier_contact_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    contact_type_code: req.body.contact_type_code,
                    supplier_id: req.body.supplier_id,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y',
                    supplier_contact_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSupplierContact = await sequelize.query(
                `SELECT * FROM supplier_contact WHERE supplier_contact_id = :supplier_contact_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { supplier_contact_id: req.params.id }
                }
            );
            res.json(updatedSupplierContact[0]);
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplierContact = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM supplier_contact WHERE supplier_contact_id = :supplier_contact_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { supplier_contact_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

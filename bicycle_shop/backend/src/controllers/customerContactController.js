const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllCustomerContacts = async (req, res) => {
    try {
        const customerContacts = await sequelize.query(
            `SELECT 
                cc.customer_contact_id,
                cc.customer_id,
                CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
                ct.description AS contact_type,
                cc.contact_value,
                cc.is_primary,
                cc.is_active
            FROM customer_contact cc
            JOIN customer c ON cc.customer_id = c.customer_id
            JOIN contact_type ct ON cc.contact_type_code = ct.contact_type_code`,
            { type: QueryTypes.SELECT }
        );
        res.json(customerContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerContactById = async (req, res) => {
    try {
        const customerContact = await sequelize.query(
            `SELECT * FROM customer_contact WHERE customer_contact_id = :customer_contact_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { customer_contact_id: req.params.id }
            }
        );

        if (customerContact.length > 0) {
            res.json(customerContact[0]);
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCustomerContact = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO customer_contact (customer_id, contact_type_code, contact_value, is_active, is_primary)
             VALUES (:customer_id, :contact_type_code, :contact_value, :is_active, :is_primary)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    customer_id: req.body.customer_id,
                    contact_type_code: req.body.contact_type_code,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y'
                }
            }
        );

        res.status(201).json({ message: 'Customer contact created successfully', customer_contact_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomerContact = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE customer_contact SET 
                customer_id = :customer_id,
                contact_type_code = :contact_type_code,
                contact_value = :contact_value,
                is_active = :is_active,
                is_primary = :is_primary
             WHERE customer_contact_id = :customer_contact_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    customer_id: req.body.customer_id,
                    contact_type_code: req.body.contact_type_code,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y',
                    customer_contact_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedCustomerContact = await sequelize.query(
                `SELECT * FROM customer_contact WHERE customer_contact_id = :customer_contact_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { customer_contact_id: req.params.id }
                }
            );
            res.json(updatedCustomerContact[0]);
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomerContact = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM customer_contact WHERE customer_contact_id = :customer_contact_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { customer_contact_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

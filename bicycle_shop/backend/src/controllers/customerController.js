const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await sequelize.query(
            `SELECT * FROM customer`,
            { type: QueryTypes.SELECT }
        );
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await sequelize.query(
            `SELECT * FROM customer WHERE customer_id = :id`,
            {
                type: QueryTypes.SELECT,
                replacements: { id: req.params.id }
            }
        );

        if (customer.length > 0) {
            res.json(customer[0]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO customer (first_name, last_name, middle_name, gender)
             VALUES (:first_name, :last_name, :middle_name, :gender)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    middle_name: req.body.middle_name || null,
                    gender: req.body.gender || null
                }
            }
        );

        res.status(201).json({ message: 'Customer created successfully', customer_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE customer SET 
                first_name = :first_name,
                last_name = :last_name,
                middle_name = :middle_name,
                gender = :gender
             WHERE customer_id = :id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    middle_name: req.body.middle_name || null,
                    gender: req.body.gender || null,
                    id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedCustomer = await sequelize.query(
                `SELECT * FROM customer WHERE customer_id = :id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { id: req.params.id }
                }
            );
            res.json(updatedCustomer[0]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM customer WHERE customer_id = :id`,
            {
                type: QueryTypes.DELETE,
                replacements: { id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

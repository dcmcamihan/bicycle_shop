const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await sequelize.query(
            `SELECT * FROM payment_method`,
            { type: QueryTypes.SELECT }
        );
        res.json(paymentMethods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPaymentMethodByCode = async (req, res) => {
    try {
        const paymentMethod = await sequelize.query(
            `SELECT * FROM payment_method WHERE payment_method_code = :payment_method_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { payment_method_code: req.params.code }
            }
        );

        if (paymentMethod.length > 0) {
            res.json(paymentMethod[0]);
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPaymentMethod = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO payment_method (payment_method_code, description)
             VALUES (:payment_method_code, :description)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    payment_method_code: req.body.payment_method_code,
                    description: req.body.description
                }
            }
        );

        res.status(201).json({ message: 'Payment method created successfully', payment_method_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePaymentMethod = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE payment_method SET description = :description
             WHERE payment_method_code = :payment_method_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    description: req.body.description,
                    payment_method_code: req.params.code
                }
            }
        );

        if (updated) {
            const updatedPaymentMethod = await sequelize.query(
                `SELECT * FROM payment_method WHERE payment_method_code = :payment_method_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { payment_method_code: req.params.code }
                }
            );
            res.json(updatedPaymentMethod[0]);
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePaymentMethod = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM payment_method WHERE payment_method_code = :payment_method_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { payment_method_code: req.params.code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

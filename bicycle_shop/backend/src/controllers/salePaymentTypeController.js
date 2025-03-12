const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSalePaymentTypes = async (req, res) => {
    try {
        const salePaymentTypes = await sequelize.query(
            `SELECT * FROM sale_payment_type`,
            { type: QueryTypes.SELECT }
        );
        res.json(salePaymentTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalePaymentTypeByCode = async (req, res) => {
    try {
        const salePaymentType = await sequelize.query(
            `SELECT * FROM sale_payment_type WHERE sale_payment_type_code = :sale_payment_type_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { sale_payment_type_code: req.params.sale_payment_type_code }
            }
        );

        if (salePaymentType.length > 0) {
            res.json(salePaymentType[0]);
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSalePaymentType = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO sale_payment_type (sale_payment_type_code, sale_id, payment_method_code, reference_number)
             VALUES (:sale_payment_type_code, :sale_id, :payment_method_code, :reference_number)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    sale_payment_type_code: req.body.sale_payment_type_code,
                    sale_id: req.body.sale_id,
                    payment_method_code: req.body.payment_method_code,
                    reference_number: req.body.reference_number || null
                }
            }
        );

        res.status(201).json({ message: 'Sale payment type created successfully', sale_payment_type_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSalePaymentType = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE sale_payment_type SET 
                sale_id = :sale_id,
                payment_method_code = :payment_method_code,
                reference_number = :reference_number
             WHERE sale_payment_type_code = :sale_payment_type_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    sale_id: req.body.sale_id,
                    payment_method_code: req.body.payment_method_code,
                    reference_number: req.body.reference_number || null,
                    sale_payment_type_code: req.params.sale_payment_type_code
                }
            }
        );

        if (updated) {
            const updatedSalePaymentType = await sequelize.query(
                `SELECT * FROM sale_payment_type WHERE sale_payment_type_code = :sale_payment_type_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { sale_payment_type_code: req.params.sale_payment_type_code }
                }
            );
            res.json(updatedSalePaymentType[0]);
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSalePaymentType = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM sale_payment_type WHERE sale_payment_type_code = :sale_payment_type_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { sale_payment_type_code: req.params.sale_payment_type_code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

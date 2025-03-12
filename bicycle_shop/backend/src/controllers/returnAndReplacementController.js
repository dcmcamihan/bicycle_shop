const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllReturnAndReplacements = async (req, res) => {
    try {
        const returnAndReplacements = await sequelize.query(
            `SELECT * FROM return_and_replacement`,
            { type: QueryTypes.SELECT }
        );
        res.json(returnAndReplacements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReturnAndReplacementById = async (req, res) => {
    try {
        const returnAndReplacement = await sequelize.query(
            `SELECT * FROM return_and_replacement WHERE return_id = :return_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { return_id: req.params.id }
            }
        );

        if (returnAndReplacement.length > 0) {
            res.json(returnAndReplacement[0]);
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReturnAndReplacement = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO return_and_replacement (sale_detail_id, return_status, transaction_date, remarks)
             VALUES (:sale_detail_id, :return_status, :transaction_date, :remarks)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    sale_detail_id: req.body.sale_detail_id,
                    return_status: req.body.return_status,
                    transaction_date: req.body.transaction_date,
                    remarks: req.body.remarks || null
                }
            }
        );

        res.status(201).json({ message: 'Return and replacement created successfully', return_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReturnAndReplacement = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE return_and_replacement SET 
                sale_detail_id = :sale_detail_id,
                return_status = :return_status,
                transaction_date = :transaction_date,
                remarks = :remarks
             WHERE return_id = :return_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    sale_detail_id: req.body.sale_detail_id,
                    return_status: req.body.return_status,
                    transaction_date: req.body.transaction_date,
                    remarks: req.body.remarks || null,
                    return_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedReturnAndReplacement = await sequelize.query(
                `SELECT * FROM return_and_replacement WHERE return_id = :return_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { return_id: req.params.id }
                }
            );
            res.json(updatedReturnAndReplacement[0]);
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReturnAndReplacement = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM return_and_replacement WHERE return_id = :return_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { return_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllStatusReferenceCodes = async (req, res) => {
    try {
        const statusReferenceCodes = await sequelize.query(
            `SELECT * FROM status_reference_code`,
            { type: QueryTypes.SELECT }
        );
        res.json(statusReferenceCodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusReferenceCodeByCode = async (req, res) => {
    try {
        const statusReferenceCode = await sequelize.query(
            `SELECT * FROM status_reference_code WHERE status_reference_code = :status_reference_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { status_reference_code: req.params.status_reference_code }
            }
        );

        if (statusReferenceCode.length > 0) {
            res.json(statusReferenceCode[0]);
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStatusReferenceCode = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO status_reference_code (status_reference_code, description)
             VALUES (:status_reference_code, :description)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    status_reference_code: req.body.status_reference_code,
                    description: req.body.description || null
                }
            }
        );

        res.status(201).json({ message: 'Status reference code created successfully', status_reference_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatusReferenceCode = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE status_reference_code SET 
                description = :description
             WHERE status_reference_code = :status_reference_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    description: req.body.description || null,
                    status_reference_code: req.params.status_reference_code
                }
            }
        );

        if (updated) {
            const updatedStatusReferenceCode = await sequelize.query(
                `SELECT * FROM status_reference_code WHERE status_reference_code = :status_reference_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { status_reference_code: req.params.status_reference_code }
                }
            );
            res.json(updatedStatusReferenceCode[0]);
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStatusReferenceCode = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM status_reference_code WHERE status_reference_code = :status_reference_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { status_reference_code: req.params.status_reference_code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

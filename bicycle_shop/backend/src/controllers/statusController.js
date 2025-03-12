const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await sequelize.query(
            `SELECT * FROM status`,
            { type: QueryTypes.SELECT }
        );
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusById = async (req, res) => {
    try {
        const status = await sequelize.query(
            `SELECT * FROM status WHERE status_code = :status_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { status_code: req.params.id }
            }
        );

        if (status.length > 0) {
            res.json(status[0]);
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStatus = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO status (status_code, description, status_reference_code)
             VALUES (:status_code, :description, :status_reference_code)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    status_code: req.body.status_code,
                    description: req.body.description,
                    status_reference_code: req.body.status_reference_code
                }
            }
        );

        res.status(201).json({ message: 'Status created successfully', status_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE status SET 
                description = :description,
                status_reference_code = :status_reference_code
             WHERE status_code = :status_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    description: req.body.description,
                    status_reference_code: req.body.status_reference_code,
                    status_code: req.params.id
                }
            }
        );

        if (updated) {
            const updatedStatus = await sequelize.query(
                `SELECT * FROM status WHERE status_code = :status_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { status_code: req.params.id }
                }
            );
            res.json(updatedStatus[0]);
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStatus = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM status WHERE status_code = :status_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { status_code: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusesByReferenceCode = async (req, res) => {
    try {
        const statuses = await sequelize.query(
            `SELECT * FROM status WHERE status_reference_code = :status_reference_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { status_reference_code: req.params.reference_code }
            }
        );

        if (statuses.length > 0) {
            res.json(statuses);
        } else {
            res.status(404).json({ message: 'Statuses not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

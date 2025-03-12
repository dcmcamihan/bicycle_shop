const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllRoleTypes = async (req, res) => {
    try {
        const roleTypes = await sequelize.query(
            `SELECT * FROM role_type`,
            { type: QueryTypes.SELECT }
        );
        res.json(roleTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoleTypeByCode = async (req, res) => {
    try {
        const roleType = await sequelize.query(
            `SELECT * FROM role_type WHERE role_type_code = :role_type_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { role_type_code: req.params.role_type_code }
            }
        );

        if (roleType.length > 0) {
            res.json(roleType[0]);
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRoleType = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO role_type (role_type_code, description)
             VALUES (:role_type_code, :description)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    role_type_code: req.body.role_type_code,
                    description: req.body.description || null
                }
            }
        );

        res.status(201).json({ message: 'Role type created successfully', role_type_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoleType = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE role_type SET description = :description
             WHERE role_type_code = :role_type_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    description: req.body.description || null,
                    role_type_code: req.params.role_type_code
                }
            }
        );

        if (updated) {
            const updatedRoleType = await sequelize.query(
                `SELECT * FROM role_type WHERE role_type_code = :role_type_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { role_type_code: req.params.role_type_code }
                }
            );
            res.json(updatedRoleType[0]);
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRoleType = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM role_type WHERE role_type_code = :role_type_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { role_type_code: req.params.role_type_code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

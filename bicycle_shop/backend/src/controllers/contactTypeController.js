const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllContactTypes = async (req, res) => {
    try {
        const contactTypes = await sequelize.query(
            `SELECT * FROM contact_type`,
            { type: QueryTypes.SELECT }
        );
        res.json(contactTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactTypeByCode = async (req, res) => {
    try {
        const contactType = await sequelize.query(
            `SELECT * FROM contact_type WHERE contact_type_code = :contact_type_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { contact_type_code: req.params.contact_type_code }
            }
        );

        if (contactType.length > 0) {
            res.json(contactType[0]);
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createContactType = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO contact_type (contact_type_code, description)
             VALUES (:contact_type_code, :description)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    contact_type_code: req.body.contact_type_code,
                    description: req.body.description
                }
            }
        );

        res.status(201).json({ message: 'Contact type created successfully', contact_type_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContactType = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE contact_type SET description = :description
             WHERE contact_type_code = :contact_type_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    description: req.body.description,
                    contact_type_code: req.params.contact_type_code
                }
            }
        );

        if (updated) {
            const updatedContactType = await sequelize.query(
                `SELECT * FROM contact_type WHERE contact_type_code = :contact_type_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { contact_type_code: req.params.contact_type_code }
                }
            );
            res.json(updatedContactType[0]);
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteContactType = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM contact_type WHERE contact_type_code = :contact_type_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { contact_type_code: req.params.contact_type_code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

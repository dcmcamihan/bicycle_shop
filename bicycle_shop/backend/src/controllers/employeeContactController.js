const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllEmployeeContacts = async (req, res) => {
    try {
        const employeeContacts = await sequelize.query(
            `SELECT * FROM employee_contact`,
            { type: QueryTypes.SELECT }
        );
        res.json(employeeContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeContactById = async (req, res) => {
    try {
        const employeeContact = await sequelize.query(
            `SELECT * FROM employee_contact WHERE employee_contact_id = :employee_contact_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { employee_contact_id: req.params.id }
            }
        );

        if (employeeContact.length > 0) {
            res.json(employeeContact[0]);
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeContact = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO employee_contact (employee_id, contact_type_code, contact_value, is_active, is_primary)
             VALUES (:employee_id, :contact_type_code, :contact_value, :is_active, :is_primary)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    employee_id: req.body.employee_id,
                    contact_type_code: req.body.contact_type_code,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y'
                }
            }
        );

        res.status(201).json({ message: 'Employee contact created successfully', employee_contact_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeContact = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE employee_contact SET 
                employee_id = :employee_id,
                contact_type_code = :contact_type_code,
                contact_value = :contact_value,
                is_active = :is_active,
                is_primary = :is_primary
             WHERE employee_contact_id = :employee_contact_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    employee_id: req.body.employee_id,
                    contact_type_code: req.body.contact_type_code,
                    contact_value: req.body.contact_value,
                    is_active: req.body.is_active || 'Y',
                    is_primary: req.body.is_primary || 'Y',
                    employee_contact_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedEmployeeContact = await sequelize.query(
                `SELECT * FROM employee_contact WHERE employee_contact_id = :employee_contact_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { employee_contact_id: req.params.id }
                }
            );
            res.json(updatedEmployeeContact[0]);
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeContact = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM employee_contact WHERE employee_contact_id = :employee_contact_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { employee_contact_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

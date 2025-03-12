const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllEmployeeRoleHistories = async (req, res) => {
    try {
        const employeeRoleHistories = await sequelize.query(
            `SELECT * FROM employee_role_history`,
            { type: QueryTypes.SELECT }
        );
        res.json(employeeRoleHistories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeRoleHistoryById = async (req, res) => {
    try {
        const employeeRoleHistory = await sequelize.query(
            `SELECT * FROM employee_role_history WHERE role_history_id = :role_history_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { role_history_id: req.params.id }
            }
        );

        if (employeeRoleHistory.length > 0) {
            res.json(employeeRoleHistory[0]);
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeRoleHistory = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO employee_role_history (employee_id, role_type, date_effectivity)
             VALUES (:employee_id, :role_type, :date_effectivity)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    employee_id: req.body.employee_id,
                    role_type: req.body.role_type,
                    date_effectivity: req.body.date_effectivity
                }
            }
        );

        res.status(201).json({ message: 'Employee role history created successfully', role_history_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeRoleHistory = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE employee_role_history SET 
                employee_id = :employee_id,
                role_type = :role_type,
                date_effectivity = :date_effectivity
             WHERE role_history_id = :role_history_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    employee_id: req.body.employee_id,
                    role_type: req.body.role_type,
                    date_effectivity: req.body.date_effectivity,
                    role_history_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedEmployeeRoleHistory = await sequelize.query(
                `SELECT * FROM employee_role_history WHERE role_history_id = :role_history_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { role_history_id: req.params.id }
                }
            );
            res.json(updatedEmployeeRoleHistory[0]);
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeRoleHistory = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM employee_role_history WHERE role_history_id = :role_history_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { role_history_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

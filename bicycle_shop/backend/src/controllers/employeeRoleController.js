const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllEmployeeRoles = async (req, res) => {
    try {
        const employeeRoles = await sequelize.query(
            `SELECT * FROM employee_role`,
            { type: QueryTypes.SELECT }
        );
        res.json(employeeRoles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeRoleById = async (req, res) => {
    try {
        const employeeRole = await sequelize.query(
            `SELECT * FROM employee_role WHERE employee_role_id = :employee_role_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { employee_role_id: req.params.id }
            }
        );

        if (employeeRole.length > 0) {
            res.json(employeeRole[0]);
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeRole = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO employee_role (employee_id, role_type_code, specialization)
             VALUES (:employee_id, :role_type_code, :specialization)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    employee_id: req.body.employee_id,
                    role_type_code: req.body.role_type_code,
                    specialization: req.body.specialization || null
                }
            }
        );

        res.status(201).json({ message: 'Employee role created successfully', employee_role_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeRole = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE employee_role SET 
                employee_id = :employee_id,
                role_type_code = :role_type_code,
                specialization = :specialization
             WHERE employee_role_id = :employee_role_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    employee_id: req.body.employee_id,
                    role_type_code: req.body.role_type_code,
                    specialization: req.body.specialization || null,
                    employee_role_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedEmployeeRole = await sequelize.query(
                `SELECT * FROM employee_role WHERE employee_role_id = :employee_role_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { employee_role_id: req.params.id }
                }
            );
            res.json(updatedEmployeeRole[0]);
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeRole = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM employee_role WHERE employee_role_id = :employee_role_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { employee_role_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

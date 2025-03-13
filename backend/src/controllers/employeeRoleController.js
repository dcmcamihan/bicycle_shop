const EmployeeRole = require('../models/employeeRoleModel');

exports.getAllEmployeeRoles = async (req, res) => {
    try {
        const employeeRoles = await EmployeeRole.findAll();
        res.json(employeeRoles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeRoleById = async (req, res) => {
    try {
        const employeeRole = await EmployeeRole.findByPk(req.params.id);
        if (employeeRole) {
            res.json(employeeRole);
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeRole = async (req, res) => {
    try {
        const newEmployeeRole = await EmployeeRole.create(req.body);
        res.status(201).json(newEmployeeRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeRole = async (req, res) => {
    try {
        const [updated] = await EmployeeRole.update(req.body, {
            where: { employee_role_id: req.params.id }
        });
        if (updated) {
            const updatedEmployeeRole = await EmployeeRole.findByPk(req.params.id);
            res.json(updatedEmployeeRole);
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeRole = async (req, res) => {
    try {
        const deleted = await EmployeeRole.destroy({
            where: { employee_role_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
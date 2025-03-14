const EmployeeRoleHistory = require('../models/employeeRoleHistoryModel');

exports.getAllEmployeeRoleHistories = async (req, res) => {
    try {
        const employeeRoleHistories = await EmployeeRoleHistory.findAll();
        res.json(employeeRoleHistories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeRoleHistoryById = async (req, res) => {
    try {
        const employeeRoleHistory = await EmployeeRoleHistory.findByPk(req.params.id);
        if (employeeRoleHistory) {
            res.json(employeeRoleHistory);
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeRoleHistory = async (req, res) => {
    try {
        const newEmployeeRoleHistory = await EmployeeRoleHistory.create(req.body);
        res.status(201).json(newEmployeeRoleHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeRoleHistory = async (req, res) => {
    try {
        const [updated] = await EmployeeRoleHistory.update(req.body, {
            where: { employee_role_history_id: req.params.id }
        });
        if (updated) {
            const updatedEmployeeRoleHistory = await EmployeeRoleHistory.findByPk(req.params.id);
            res.json(updatedEmployeeRoleHistory);
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeRoleHistory = async (req, res) => {
    try {
        const deleted = await EmployeeRoleHistory.destroy({
            where: { employee_role_history_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee role history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
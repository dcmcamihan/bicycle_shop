const EmployeeAttendance = require('../models/employeeAttendanceModel');

exports.getAllEmployeeAttendances = async (req, res) => {
    try {
        const employeeAttendances = await EmployeeAttendance.findAll();
        res.json(employeeAttendances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeAttendanceById = async (req, res) => {
    try {
        const employeeAttendance = await EmployeeAttendance.findByPk(req.params.id);
        if (employeeAttendance) {
            res.json(employeeAttendance);
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeAttendance = async (req, res) => {
    try {
        const newEmployeeAttendance = await EmployeeAttendance.create(req.body);
        res.status(201).json(newEmployeeAttendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeAttendance = async (req, res) => {
    try {
        const [updated] = await EmployeeAttendance.update(req.body, {
            where: { employee_attendance_id: req.params.id }
        });
        if (updated) {
            const updatedEmployeeAttendance = await EmployeeAttendance.findByPk(req.params.id);
            res.json(updatedEmployeeAttendance);
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeAttendance = async (req, res) => {
    try {
        const deleted = await EmployeeAttendance.destroy({
            where: { employee_attendance_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee attendance not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
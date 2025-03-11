const bcrypt = require('bcrypt');
const Employee = require('../models/employeeModel');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newEmployee = await Employee.create({ ...req.body, password: hashedPassword });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const [updated] = await Employee.update(req.body, {
            where: { employee_id: req.params.id }
        });
        if (updated) {
            const updatedEmployee = await Employee.findByPk(req.params.id);
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.destroy({
            where: { employee_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.findEmployeeByUsernameAndPassword = async (req, res) => {
    try {
        const { username, password } = req.body;
        const employee = await Employee.findOne({ where: { username } });
        if (employee) {
            const isPasswordValid = await bcrypt.compare(password, employee.password);
            if (isPasswordValid) {
                res.json(employee);
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateSession = async (req, res) => {
    try {
        const { sessionToken } = req.body;
        const [employee_id, base64Password] = sessionToken.split(':');
        const password = Buffer.from(base64Password, 'base64').toString('utf-8');

        const employee = await Employee.findByPk(employee_id);
        if (employee) {
            if (password === employee.password) {
                res.json({ valid: true });
            } else {
                res.status(401).json({ valid: false });
            }
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
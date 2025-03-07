const employeeModel = require('../models/employeeModel');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeModel.getEmployeeById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const employeeData = { ...req.body, password: hashedPassword };
        const employeeId = await employeeModel.createEmployee(employeeData);
        res.status(201).json({ employee_id: employeeId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        await employeeModel.updateEmployee(req.params.id, req.body);
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        await employeeModel.deleteEmployee(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
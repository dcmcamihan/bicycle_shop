const EmployeeContact = require('../models/employeeContactModel');

exports.getAllEmployeeContacts = async (req, res) => {
    try {
        const employeeContacts = await EmployeeContact.findAll();
        res.json(employeeContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeContactById = async (req, res) => {
    try {
        const employeeContact = await EmployeeContact.findByPk(req.params.id);
        if (employeeContact) {
            res.json(employeeContact);
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployeeContact = async (req, res) => {
    try {
        const newEmployeeContact = await EmployeeContact.create(req.body);
        res.status(201).json(newEmployeeContact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployeeContact = async (req, res) => {
    try {
        const [updated] = await EmployeeContact.update(req.body, {
            where: { employee_contact_id: req.params.id }
        });
        if (updated) {
            const updatedEmployeeContact = await EmployeeContact.findByPk(req.params.id);
            res.json(updatedEmployeeContact);
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployeeContact = async (req, res) => {
    try {
        const deleted = await EmployeeContact.destroy({
            where: { employee_contact_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Employee contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
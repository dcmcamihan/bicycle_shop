const CustomerContact = require('../models/customerContactModel');

exports.getAllCustomerContacts = async (req, res) => {
    try {
        const customerContacts = await CustomerContact.findAll();
        res.json(customerContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerContactById = async (req, res) => {
    try {
        const customerContact = await CustomerContact.findByPk(req.params.id);
        if (customerContact) {
            res.json(customerContact);
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCustomerContact = async (req, res) => {
    try {
        const newCustomerContact = await CustomerContact.create(req.body);
        res.status(201).json(newCustomerContact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomerContact = async (req, res) => {
    try {
        const [updated] = await CustomerContact.update(req.body, {
            where: { customer_contact_id: req.params.id }
        });
        if (updated) {
            const updatedCustomerContact = await CustomerContact.findByPk(req.params.id);
            res.json(updatedCustomerContact);
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomerContact = async (req, res) => {
    try {
        const deleted = await CustomerContact.destroy({
            where: { customer_contact_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Customer contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
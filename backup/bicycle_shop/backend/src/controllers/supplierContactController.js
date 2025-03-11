const SupplierContact = require('../models/supplierContactModel');

exports.getAllSupplierContacts = async (req, res) => {
    try {
        const supplierContacts = await SupplierContact.findAll();
        res.json(supplierContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierContactById = async (req, res) => {
    try {
        const supplierContact = await SupplierContact.findByPk(req.params.id);
        if (supplierContact) {
            res.json(supplierContact);
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplierContact = async (req, res) => {
    try {
        const newSupplierContact = await SupplierContact.create(req.body);
        res.status(201).json(newSupplierContact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplierContact = async (req, res) => {
    try {
        const [updated] = await SupplierContact.update(req.body, {
            where: { supplier_contact_id: req.params.id }
        });
        if (updated) {
            const updatedSupplierContact = await SupplierContact.findByPk(req.params.id);
            res.json(updatedSupplierContact);
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplierContact = async (req, res) => {
    try {
        const deleted = await SupplierContact.destroy({
            where: { supplier_contact_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
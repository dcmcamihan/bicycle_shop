const SupplierAddress = require('../models/supplierAddressModel');

exports.getAllSupplierAddresses = async (req, res) => {
    try {
        const supplierAddresses = await SupplierAddress.findAll();
        res.json(supplierAddresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierAddressById = async (req, res) => {
    try {
        const supplierAddress = await SupplierAddress.findByPk(req.params.id);
        if (supplierAddress) {
            res.json(supplierAddress);
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplierAddress = async (req, res) => {
    try {
        const newSupplierAddress = await SupplierAddress.create(req.body);
        res.status(201).json(newSupplierAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplierAddress = async (req, res) => {
    try {
        const [updated] = await SupplierAddress.update(req.body, {
            where: { address_id: req.params.id }
        });
        if (updated) {
            const updatedSupplierAddress = await SupplierAddress.findByPk(req.params.id);
            res.json(updatedSupplierAddress);
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplierAddress = async (req, res) => {
    try {
        const deleted = await SupplierAddress.destroy({
            where: { address_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
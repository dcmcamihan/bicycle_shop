const Supplier = require('../models/supplierModel');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const newSupplier = await Supplier.create(req.body);
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const [updated] = await Supplier.update(req.body, {
            where: { supplier_id: req.params.id }
        });
        if (updated) {
            const updatedSupplier = await Supplier.findByPk(req.params.id);
            res.json(updatedSupplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.destroy({
            where: { supplier_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
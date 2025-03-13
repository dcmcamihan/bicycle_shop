const Supply = require('../models/supplyModel');

exports.getAllSupplies = async (req, res) => {
    try {
        const supplies = await Supply.findAll();
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplyById = async (req, res) => {
    try {
        const supply = await Supply.findByPk(req.params.id);
        if (supply) {
            res.json(supply);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupply = async (req, res) => {
    try {
        const newSupply = await Supply.create(req.body);
        res.status(201).json(newSupply);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupply = async (req, res) => {
    try {
        const [updated] = await Supply.update(req.body, {
            where: { supply_id: req.params.id }
        });
        if (updated) {
            const updatedSupply = await Supply.findByPk(req.params.id);
            res.json(updatedSupply);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupply = async (req, res) => {
    try {
        const deleted = await Supply.destroy({
            where: { supply_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
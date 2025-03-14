const Stockout = require('../models/stockoutModel');

exports.getAllStockouts = async (req, res) => {
    try {
        const stockouts = await Stockout.findAll();
        res.json(stockouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStockoutById = async (req, res) => {
    try {
        const stockout = await Stockout.findByPk(req.params.id);
        if (stockout) {
            res.json(stockout);
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStockout = async (req, res) => {
    try {
        const newStockout = await Stockout.create(req.body);
        res.status(201).json(newStockout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStockout = async (req, res) => {
    try {
        const [updated] = await Stockout.update(req.body, {
            where: { stockout_id: req.params.id }
        });
        if (updated) {
            const updatedStockout = await Stockout.findByPk(req.params.id);
            res.json(updatedStockout);
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStockout = async (req, res) => {
    try {
        const deleted = await Stockout.destroy({
            where: { stockout_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Stockout not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
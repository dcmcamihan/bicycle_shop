const Sale = require('../models/saleModel');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.findAll();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSale = async (req, res) => {
    try {
        const newSale = await Sale.create(req.body);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const [updated] = await Sale.update(req.body, {
            where: { sale_id: req.params.id }
        });
        if (updated) {
            const updatedSale = await Sale.findByPk(req.params.id);
            res.json(updatedSale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const deleted = await Sale.destroy({
            where: { sale_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
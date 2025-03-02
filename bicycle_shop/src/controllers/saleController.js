const saleModel = require('../models/saleModel');

const getAllSales = async (req, res) => {
    try {
        const sales = await saleModel.getAllSales();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSaleById = async (req, res) => {
    try {
        const sale = await saleModel.getSaleById(req.params.id);
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSale = async (req, res) => {
    try {
        const saleId = await saleModel.createSale(req.body);
        res.status(201).json({ sale_id: saleId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSale = async (req, res) => {
    try {
        await saleModel.updateSale(req.params.id, req.body);
        res.json({ message: 'Sale updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        await saleModel.deleteSale(req.params.id);
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
};
const SaleDetails = require('../models/saleDetailsModel');

exports.getAllSaleDetails = async (req, res) => {
    try {
        const saleDetails = await SaleDetails.findAll();
        res.json(saleDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleDetailsById = async (req, res) => {
    try {
        const saleDetails = await SaleDetails.findByPk(req.params.id);
        if (saleDetails) {
            res.json(saleDetails);
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleDetailsBySaleId = async (req, res) => {
    try {
        const saleDetails = await SaleDetails.findAll({
            where: { sale_id: req.params.saleId }
        });
        if (saleDetails.length > 0) {
            res.json(saleDetails);
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSaleDetails = async (req, res) => {
    try {
        const newSaleDetails = await SaleDetails.create(req.body);
        res.status(201).json(newSaleDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSaleDetails = async (req, res) => {
    try {
        const [updated] = await SaleDetails.update(req.body, {
            where: { sale_details_id: req.params.id }
        });
        if (updated) {
            const updatedSaleDetails = await SaleDetails.findByPk(req.params.id);
            res.json(updatedSaleDetails);
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSaleDetails = async (req, res) => {
    try {
        const deleted = await SaleDetails.destroy({
            where: { sale_details_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
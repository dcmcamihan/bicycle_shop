const SalePaymentType = require('../models/salePaymentTypeModel');

exports.getAllSalePaymentTypes = async (req, res) => {
    try {
        const salePaymentTypes = await SalePaymentType.findAll();
        res.json(salePaymentTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalePaymentTypeByCode = async (req, res) => {
    try {
        const salePaymentType = await SalePaymentType.findByPk(req.params.sale_payment_type_code);
        if (salePaymentType) {
            res.json(salePaymentType);
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSalePaymentType = async (req, res) => {
    try {
        const newSalePaymentType = await SalePaymentType.create(req.body);
        res.status(201).json(newSalePaymentType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSalePaymentType = async (req, res) => {
    try {
        const [updated] = await SalePaymentType.update(req.body, {
            where: { sale_payment_type_code: req.params.sale_payment_type_code }
        });
        if (updated) {
            const updatedSalePaymentType = await SalePaymentType.findByPk(req.params.sale_payment_type_code);
            res.json(updatedSalePaymentType);
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSalePaymentType = async (req, res) => {
    try {
        const deleted = await SalePaymentType.destroy({
            where: { sale_payment_type_code: req.params.sale_payment_type_code }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale payment type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
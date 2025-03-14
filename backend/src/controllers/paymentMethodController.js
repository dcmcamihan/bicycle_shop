const PaymentMethod = require('../models/paymentMethodModel');

exports.getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.json(paymentMethods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPaymentMethodByCode = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findByPk(req.params.paymentMethodCode);
        if (paymentMethod) {
            res.json(paymentMethod);
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPaymentMethod = async (req, res) => {
    try {
        const newPaymentMethod = await PaymentMethod.create(req.body);
        res.status(201).json(newPaymentMethod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePaymentMethod = async (req, res) => {
    try {
        const [updated] = await PaymentMethod.update(req.body, {
            where: { payment_method_code: req.params.paymentMethodCode }
        });
        if (updated) {
            const updatedPaymentMethod = await PaymentMethod.findByPk(req.params.code);
            res.json(updatedPaymentMethod);
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePaymentMethod = async (req, res) => {
    try {
        const deleted = await PaymentMethod.destroy({
            where: { payment_method_code: req.params.paymentMethodCode }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Payment method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const StatusReferenceCode = require('../models/statusReferenceCodeModel');

exports.getAllStatusReferenceCodes = async (req, res) => {
    try {
        const statusReferenceCodes = await StatusReferenceCode.findAll();
        res.json(statusReferenceCodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusReferenceCodeByCode = async (req, res) => {
    try {
        const statusReferenceCode = await StatusReferenceCode.findByPk(req.params.status_reference_code);
        if (statusReferenceCode) {
            res.json(statusReferenceCode);
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStatusReferenceCode = async (req, res) => {
    try {
        const newStatusReferenceCode = await StatusReferenceCode.create(req.body);
        res.status(201).json(newStatusReferenceCode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatusReferenceCode = async (req, res) => {
    try {
        const [updated] = await StatusReferenceCode.update(req.body, {
            where: { status_reference_code: req.params.status_reference_code }
        });
        if (updated) {
            const updatedStatusReferenceCode = await StatusReferenceCode.findByPk(req.params.status_reference_code);
            res.json(updatedStatusReferenceCode);
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStatusReferenceCode = async (req, res) => {
    try {
        const deleted = await StatusReferenceCode.destroy({
            where: { status_reference_code: req.params.status_reference_code }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Status reference code not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
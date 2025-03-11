const ReturnAndReplacement = require('../models/returnAndReplacementModel');

exports.getAllReturnAndReplacements = async (req, res) => {
    try {
        const returnAndReplacements = await ReturnAndReplacement.findAll();
        res.json(returnAndReplacements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReturnAndReplacementById = async (req, res) => {
    try {
        const returnAndReplacement = await ReturnAndReplacement.findByPk(req.params.id);
        if (returnAndReplacement) {
            res.json(returnAndReplacement);
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReturnAndReplacement = async (req, res) => {
    try {
        const newReturnAndReplacement = await ReturnAndReplacement.create(req.body);
        res.status(201).json(newReturnAndReplacement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReturnAndReplacement = async (req, res) => {
    try {
        const [updated] = await ReturnAndReplacement.update(req.body, {
            where: { return_and_replacement_id: req.params.id }
        });
        if (updated) {
            const updatedReturnAndReplacement = await ReturnAndReplacement.findByPk(req.params.id);
            res.json(updatedReturnAndReplacement);
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReturnAndReplacement = async (req, res) => {
    try {
        const deleted = await ReturnAndReplacement.destroy({
            where: { return_and_replacement_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Return and replacement not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
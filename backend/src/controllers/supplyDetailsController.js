const SupplyDetails = require('../models/supplyDetailsModel');

exports.getAllSupplyDetails = async (req, res) => {
    try {
        const supplyDetails = await SupplyDetails.findAll();
        res.json(supplyDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplyDetailsById = async (req, res) => {
    try {
        const supplyDetails = await SupplyDetails.findByPk(req.params.id);
        if (supplyDetails) {
            res.json(supplyDetails);
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplyDetails = async (req, res) => {
    try {
        const newSupplyDetails = await SupplyDetails.create(req.body);
        res.status(201).json(newSupplyDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplyDetails = async (req, res) => {
    try {
        const [updated] = await SupplyDetails.update(req.body, {
            where: { supply_details_id: req.params.id }
        });
        if (updated) {
            const updatedSupplyDetails = await SupplyDetails.findByPk(req.params.id);
            res.json(updatedSupplyDetails);
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplyDetails = async (req, res) => {
    try {
        const deleted = await SupplyDetails.destroy({
            where: { supply_details_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Supply details not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSupplyDetailsBySupplyId = async (req, res) => {
    try {
        const supplyDetails = await SupplyDetails.findAll({
            where: { supply_id: req.params.supplyId }
        });
        if (supplyDetails.length > 0) {
            res.json(supplyDetails);
        } else {
            res.status(404).json({ message: 'No supply details found for this supply ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
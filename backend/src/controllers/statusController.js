const Status = require('../models/statusModel');

exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusById = async (req, res) => {
    try {
        const status = await Status.findByPk(req.params.id);
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStatus = async (req, res) => {
    try {
        const newStatus = await Status.create(req.body);
        res.status(201).json(newStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const [updated] = await Status.update(req.body, {
            where: { status_id: req.params.id }
        });
        if (updated) {
            const updatedStatus = await Status.findByPk(req.params.id);
            res.json(updatedStatus);
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStatus = async (req, res) => {
    try {
        const deleted = await Status.destroy({
            where: { status_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatusesByReferenceCode = async (req, res) => {
    try {
        const statuses = await Status.findAll({
            where: { status_reference_code: req.params.reference_code }
        });
        if (statuses.length > 0) {
            res.json(statuses);
        } else {
            res.status(404).json({ message: 'Statuses not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
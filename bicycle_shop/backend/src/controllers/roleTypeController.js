const RoleType = require('../models/roleTypeModel');

exports.getAllRoleTypes = async (req, res) => {
    try {
        const roleTypes = await RoleType.findAll();
        res.json(roleTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoleTypeByCode = async (req, res) => {
    try {
        const roleType = await RoleType.findByPk(req.params.role_type_code);
        if (roleType) {
            res.json(roleType);
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRoleType = async (req, res) => {
    try {
        const newRoleType = await RoleType.create(req.body);
        res.status(201).json(newRoleType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoleType = async (req, res) => {
    try {
        const [updated] = await RoleType.update(req.body, {
            where: { role_type_code: req.params.role_type_code }
        });
        if (updated) {
            const updatedRoleType = await RoleType.findByPk(req.params.role_type_code);
            res.json(updatedRoleType);
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRoleType = async (req, res) => {
    try {
        const deleted = await RoleType.destroy({
            where: { role_type_code: req.params.role_type_code }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Role type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
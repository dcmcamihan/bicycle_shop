const ContactType = require('../models/contactTypeModel');

exports.getAllContactTypes = async (req, res) => {
    try {
        const contactTypes = await ContactType.findAll();
        res.json(contactTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactTypeByCode = async (req, res) => {
    try {
        const contactType = await ContactType.findByPk(req.params.contact_type_code);
        if (contactType) {
            res.json(contactType);
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createContactType = async (req, res) => {
    try {
        const newContactType = await ContactType.create(req.body);
        res.status(201).json(newContactType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContactType = async (req, res) => {
    try {
        const [updated] = await ContactType.update(req.body, {
            where: { contact_type_code: req.params.contact_type_code }
        });
        if (updated) {
            const updatedContactType = await ContactType.findByPk(req.params.contact_type_code);
            res.json(updatedContactType);
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteContactType = async (req, res) => {
    try {
        const deleted = await ContactType.destroy({
            where: { contact_type_code: req.params.contact_type_code }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Contact type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
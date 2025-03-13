const Brand = require('../models/brandModel');

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBrand = async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.status(201).json(newBrand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const [updated] = await Brand.update(req.body, {
            where: { brand_id: req.params.id }
        });
        if (updated) {
            const updatedBrand = await Brand.findByPk(req.params.id);
            res.json(updatedBrand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const deleted = await Brand.destroy({
            where: { brand_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
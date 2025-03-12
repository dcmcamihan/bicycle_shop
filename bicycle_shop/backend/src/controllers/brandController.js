const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await sequelize.query(
            `SELECT * FROM brand`,
            { type: QueryTypes.SELECT }
        );
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await sequelize.query(
            `SELECT * FROM brand WHERE brand_id = :brand_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { brand_id: req.params.id }
            }
        );

        if (brand.length > 0) {
            res.json(brand[0]);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBrand = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO brand (brand_name, origin)
             VALUES (:brand_name, :origin)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    brand_name: req.body.brand_name,
                    origin: req.body.origin || null
                }
            }
        );

        res.status(201).json({ message: 'Brand created successfully', brand_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE brand SET brand_name = :brand_name, origin = :origin
             WHERE brand_id = :brand_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    brand_name: req.body.brand_name,
                    origin: req.body.origin || null,
                    brand_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedBrand = await sequelize.query(
                `SELECT * FROM brand WHERE brand_id = :brand_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { brand_id: req.params.id }
                }
            );
            res.json(updatedBrand[0]);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM brand WHERE brand_id = :brand_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { brand_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

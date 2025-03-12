const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await sequelize.query(
            `SELECT * FROM category`,
            { type: QueryTypes.SELECT }
        );
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryByCode = async (req, res) => {
    try {
        const category = await sequelize.query(
            `SELECT * FROM category WHERE category_code = :category_code`,
            {
                type: QueryTypes.SELECT,
                replacements: { category_code: req.params.category_code }
            }
        );

        if (category.length > 0) {
            res.json(category[0]);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO category (category_code, category_name)
             VALUES (:category_code, :category_name)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    category_code: req.body.category_code,
                    category_name: req.body.category_name
                }
            }
        );

        res.status(201).json({ message: 'Category created successfully', category_code: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE category SET category_name = :category_name
             WHERE category_code = :category_code`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    category_name: req.body.category_name,
                    category_code: req.params.category_code
                }
            }
        );

        if (updated) {
            const updatedCategory = await sequelize.query(
                `SELECT * FROM category WHERE category_code = :category_code`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { category_code: req.params.category_code }
                }
            );
            res.json(updatedCategory[0]);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM category WHERE category_code = :category_code`,
            {
                type: QueryTypes.DELETE,
                replacements: { category_code: req.params.category_code }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sequelize = require('../config/db');

exports.getProductQuantityOnHand = async (req, res) => {
    try {
        const productId = req.params.product_id;
        const query = `
            SELECT 
                (COALESCE((
                    SELECT SUM(quantity_supplied) 
                    FROM supply_details 
                    WHERE product_id = :productId
                ), 0) - 
                COALESCE((
                    SELECT SUM(quantity_sold) 
                    FROM sale_details 
                    WHERE product_id = :productId
                ), 0)) AS quantity_on_hand;
        `;

        const [result] = await sequelize.query(query, {
            replacements: { productId },
            type: sequelize.QueryTypes.SELECT
        });

        res.json(result.quantity_on_hand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const [products, metadata] = await sequelize.query('SELECT * FROM product');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const [products, metadata] = await sequelize.query('SELECT * FROM product WHERE product_id = :productId', {
            replacements: { productId: productId },
            type: sequelize.QueryTypes.SELECT
        });

        if (products.length > 0) {
            res.json(products[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { product_name, category_code, brand_id, price } = req.body;
        const [result, metadata] = await sequelize.query(`
            INSERT INTO product (product_name, category_code, brand_id, price)
            VALUES (:product_name, :category_code, :brand_id, :price)
        `, {
            replacements: { product_name, category_code, brand_id, price },
            type: sequelize.QueryTypes.INSERT
        });

        const productId = result;
        const [products, metadata2] = await sequelize.query('SELECT * FROM product WHERE product_id = :productId', {
            replacements: { productId: productId },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(201).json(products[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { product_name, category_code, brand_id, price } = req.body;

        const [result, metadata] = await sequelize.query(`
            UPDATE product
            SET product_name = :product_name, category_code = :category_code, brand_id = :brand_id, price = :price
            WHERE product_id = :productId
        `, {
            replacements: { product_name, category_code, brand_id, price, productId },
            type: sequelize.QueryTypes.UPDATE
        });

        if (metadata.rowCount > 0) {
            const [products, metadata2] = await sequelize.query('SELECT * FROM product WHERE product_id = :productId', {
                replacements: { productId: productId },
                type: sequelize.QueryTypes.SELECT
            });

            res.json(products[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const [result, metadata] = await sequelize.query('DELETE FROM product WHERE product_id = :productId', {
            replacements: { productId: productId },
            type: sequelize.QueryTypes.DELETE
        });

        if (metadata.rowCount > 0) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
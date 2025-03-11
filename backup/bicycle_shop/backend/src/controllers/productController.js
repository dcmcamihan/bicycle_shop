const Product = require('../models/productModel');
const SupplyDetails = require('../models/supplyDetailsModel');
const SaleDetails = require('../models/saleDetailsModel');

exports.getProductQuantityOnHand = async (req, res) => {
    try {
        const productId = req.params.product_id;

        // Sum of quantity_supplied for the given product_id
        const supplySum = await SupplyDetails.sum('quantity_supplied', {
            where: { product_id: productId }
        });

        // Sum of quantity_sold for the given product_id
        const saleSum = await SaleDetails.sum('quantity_sold', {
            where: { product_id: productId }
        });

        // Calculate quantity on hand
        const quantityOnHand = (supplySum || 0) - (saleSum || 0);

        res.json(quantityOnHand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const [updated] = await Product.update(req.body, {
            where: { product_id: req.params.id }
        });
        if (updated) {
            const updatedProduct = await Product.findByPk(req.params.id);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { product_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
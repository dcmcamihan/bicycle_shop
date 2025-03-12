const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await sequelize.query(
            `SELECT 
                s.sale_id, 
                s.sale_date, 
                c.first_name AS customer_first_name, 
                c.last_name AS customer_last_name, 
                e.first_name AS cashier_first_name, 
                e.last_name AS cashier_last_name, 
                pm.description AS payment_method_description, 
                sd.product_id, 
                p.product_name, 
                sd.quantity_sold, 
                p.price AS price_per_unit
            FROM sale s
            LEFT JOIN customer c ON s.customer_id = c.customer_id
            LEFT JOIN employee e ON s.cashier = e.employee_id
            LEFT JOIN sale_payment_type spt ON s.sale_id = spt.sale_id
            LEFT JOIN payment_method pm ON spt.payment_method_code = pm.payment_method_code
            LEFT JOIN sale_details sd ON s.sale_id = sd.sale_id
            LEFT JOIN product p ON sd.product_id = p.product_id`,
            { type: QueryTypes.SELECT }
        );
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const sale = await sequelize.query(
            `SELECT * FROM sale WHERE sale_id = :sale_id`,
            {
                type: QueryTypes.SELECT,
                replacements: { sale_id: req.params.id }
            }
        );

        if (sale.length > 0) {
            res.json(sale[0]);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSale = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `INSERT INTO sale (customer_id, sale_date, cashier, manager)
             VALUES (:customer_id, :sale_date, :cashier, :manager)`,
            {
                type: QueryTypes.INSERT,
                replacements: {
                    customer_id: req.body.customer_id,
                    sale_date: req.body.sale_date,
                    cashier: req.body.cashier,
                    manager: req.body.manager
                }
            }
        );

        res.status(201).json({ message: 'Sale created successfully', sale_id: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const [updated] = await sequelize.query(
            `UPDATE sale SET 
                customer_id = :customer_id,
                sale_date = :sale_date,
                cashier = :cashier,
                manager = :manager
             WHERE sale_id = :sale_id`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    customer_id: req.body.customer_id,
                    sale_date: req.body.sale_date,
                    cashier: req.body.cashier,
                    manager: req.body.manager,
                    sale_id: req.params.id
                }
            }
        );

        if (updated) {
            const updatedSale = await sequelize.query(
                `SELECT * FROM sale WHERE sale_id = :sale_id`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { sale_id: req.params.id }
                }
            );
            res.json(updatedSale[0]);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const deleted = await sequelize.query(
            `DELETE FROM sale WHERE sale_id = :sale_id`,
            {
                type: QueryTypes.DELETE,
                replacements: { sale_id: req.params.id }
            }
        );

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

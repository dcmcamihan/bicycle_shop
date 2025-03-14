const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        references: {
            model: 'category',
            key: 'category_code'
        }
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'brand',
            key: 'brand_id'
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'product',
    timestamps: false
});

module.exports = Product;
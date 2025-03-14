const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SaleDetails = sequelize.define('SaleDetails', {
    sale_detail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sale',
            key: 'sale_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product',
            key: 'product_id'
        }
    },
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'sale_details',
    timestamps: false
});

module.exports = SaleDetails;
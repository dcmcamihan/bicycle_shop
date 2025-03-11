const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stockout = sequelize.define('Stockout', {
    stockout_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product',
            key: 'product_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    remarks: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    stockout_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    sale_attendant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    },
    manager: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    }
}, {
    tableName: 'stockout',
    timestamps: false
});

module.exports = Stockout;
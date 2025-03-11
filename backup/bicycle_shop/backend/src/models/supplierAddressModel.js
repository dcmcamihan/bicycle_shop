const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupplierAddress = sequelize.define('SupplierAddress', {
    supplier_address_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'supplier',
            key: 'supplier_id'
        }
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barangay: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'supplier_address',
    timestamps: false
});

module.exports = SupplierAddress;
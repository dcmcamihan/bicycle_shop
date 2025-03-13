const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupplierContact = sequelize.define('SupplierContact', {
    supplier_contact_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    contact_type_code: {
        type: DataTypes.CHAR(8),
        allowNull: false
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contact_value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y'
    },
    is_primary: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y'
    }
}, {
    tableName: 'supplier_contact',
    timestamps: false
});

module.exports = SupplierContact;
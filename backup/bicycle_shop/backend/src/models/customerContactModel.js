const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerContact = sequelize.define('CustomerContact', {
    customer_contact_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'customer_id'
        }
    },
    contact_type_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        references: {
            model: 'contact_type',
            key: 'contact_type_code'
        }
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
    tableName: 'customer_contact',
    timestamps: false
});

module.exports = CustomerContact;
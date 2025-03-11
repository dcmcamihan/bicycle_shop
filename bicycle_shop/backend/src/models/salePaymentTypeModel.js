const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SalePaymentType = sequelize.define('SalePaymentType', {
    sale_payment_type_code: {
        type: DataTypes.CHAR(8),
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
    payment_method_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'payment_method',
            key: 'payment_method_code'
        }
    },
    reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'sale_payment_type',
    timestamps: false
});

module.exports = SalePaymentType;
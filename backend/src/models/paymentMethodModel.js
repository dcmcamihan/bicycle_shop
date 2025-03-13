const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentMethod = sequelize.define('PaymentMethod', {
    payment_method_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'payment_method',
    timestamps: false
});

module.exports = PaymentMethod;
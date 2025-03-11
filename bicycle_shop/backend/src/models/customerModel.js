const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
    customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING(60),
        allowNull: true,
        defaultValue: null
    },
    gender: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'customer',
    timestamps: false
});

module.exports = Customer;
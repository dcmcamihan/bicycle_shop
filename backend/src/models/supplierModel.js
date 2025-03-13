const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
    supplier_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supplier_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'supplier',
    timestamps: false
});

module.exports = Supplier;
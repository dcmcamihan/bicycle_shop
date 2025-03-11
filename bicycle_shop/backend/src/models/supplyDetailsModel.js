const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupplyDetails = sequelize.define('SupplyDetails', {
    supply_details_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supply_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'supply',
            key: 'supply_id'
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
    quantity_supplied: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'supply_details',
    timestamps: false
});

module.exports = SupplyDetails;
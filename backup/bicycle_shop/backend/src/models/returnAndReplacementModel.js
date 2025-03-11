const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReturnAndReplacement = sequelize.define('ReturnAndReplacement', {
    return_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sale_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sale_details',
            key: 'sale_detail_id'
        }
    },
    return_status: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        references: {
            model: 'status',
            key: 'status_code'
        }
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'return_and_replacement',
    timestamps: false
});

module.exports = ReturnAndReplacement;
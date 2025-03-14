const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StatusReferenceCode = sequelize.define('StatusReferenceCode', {
    status_reference_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'status_reference_code',
    timestamps: false
});

module.exports = StatusReferenceCode;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Status = sequelize.define('Status', {
    status_code: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status_reference_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        references: {
            model: 'status_reference_code',
            key: 'status_reference_code'
        }
    }
}, {
    tableName: 'status',
    timestamps: false
});

module.exports = Status;
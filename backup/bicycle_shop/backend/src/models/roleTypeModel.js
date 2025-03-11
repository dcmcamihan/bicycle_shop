const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoleType = sequelize.define('RoleType', {
    role_type_code: {
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
    tableName: 'role_type',
    timestamps: false
});

module.exports = RoleType;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeRoleHistory = sequelize.define('EmployeeRoleHistory', {
    role_history_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    },
    role_type: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    date_effectivity: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'employee_role_history',
    timestamps: false
});

module.exports = EmployeeRoleHistory;
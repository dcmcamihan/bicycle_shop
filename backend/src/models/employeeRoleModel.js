const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeRole = sequelize.define('EmployeeRole', {
    employee_role_id: {
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
    role_type_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        references: {
            model: 'role_type',
            key: 'role_type_code'
        }
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'employee_role',
    timestamps: false
});

module.exports = EmployeeRole;
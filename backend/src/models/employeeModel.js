const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null
    },
    gender: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    employee_status: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        references: {
            model: 'status',
            key: 'status_code'
        }
    }
}, {
    tableName: 'employee',
    timestamps: false
});

module.exports = Employee;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeContact = sequelize.define('EmployeeContact', {
    employee_contact_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    contact_type_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        references: {
            model: 'contact_type',
            key: 'contact_type_code'
        }
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    },
    contact_value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y'
    },
    is_primary: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y'
    }
}, {
    tableName: 'employee_contact',
    timestamps: false
});

module.exports = EmployeeContact;
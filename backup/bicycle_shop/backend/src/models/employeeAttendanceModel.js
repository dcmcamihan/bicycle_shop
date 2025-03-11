const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeAttendance = sequelize.define('EmployeeAttendance', {
    attendance_id: {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    attendance_status: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        references: {
            model: 'status',
            key: 'status_code'
        }
    }
}, {
    tableName: 'employee_attendance',
    timestamps: false
});

module.exports = EmployeeAttendance;
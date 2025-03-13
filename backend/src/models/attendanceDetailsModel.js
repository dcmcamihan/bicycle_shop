const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AttendanceDetails = sequelize.define('AttendanceDetails', {
    attendance_detail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    attendance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee_attendance',
            key: 'attendance_id'
        }
    },
    time_in: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_out: {
        type: DataTypes.TIME,
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'attendance_details',
    timestamps: false
});

module.exports = AttendanceDetails;
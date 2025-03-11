const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supply = sequelize.define('Supply', {
    supply_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'supplier',
            key: 'supplier_id'
        }
    },
    supply_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment_method_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'payment_method',
            key: 'payment_method_code'
        }
    },
    sale_attendant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    },
    manager: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employee',
            key: 'employee_id'
        }
    }
}, {
    tableName: 'supply',
    timestamps: false
});

module.exports = Supply;
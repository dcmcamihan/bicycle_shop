const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    category_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'category',
    timestamps: false
});

module.exports = Category;
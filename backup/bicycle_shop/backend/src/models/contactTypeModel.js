const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactType = sequelize.define('ContactType', {
    contact_type_code: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'contact_type',
    timestamps: false
});

module.exports = ContactType;
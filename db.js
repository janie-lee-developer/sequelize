const Sequelize = require('sequelize');

const client = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_acme_corp_db');

const Employee = client.define('employee', {
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    department: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = {
    client,
    Employee
};
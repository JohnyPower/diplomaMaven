const Sequelize = require('sequelize');

module.exports = class Users extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                userName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                refresh_token: {
                    type: DataTypes.STRING,
                    defaultValue: null
                },
                group: {
                    type: DataTypes.INTEGER,
                    defaultValue: null
                },
                type: {
                    type: DataTypes.ENUM('head', 'shift', 'teamLead', 'user', 'buyer'),
                    defaultValue: 'user'
                }
            },
            {
                sequelize,
                timestamps: false,
                freezeTableName: true
            }
        );
    }

    static associate() {
    }
};

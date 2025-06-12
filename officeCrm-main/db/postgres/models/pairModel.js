const Sequelize = require('sequelize');

module.exports = class Pairs extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                },
                pair: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                sequelize,
                timestamps: false,
                freezeTableName: true
            }
        );
    }

    static associate(models) {
    }
};

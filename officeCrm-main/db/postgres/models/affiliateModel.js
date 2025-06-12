const Sequelize = require('sequelize');
module.exports = class Affiliates extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                },
                offerName: {
                    type: DataTypes.STRING,
                },
                offer: {
                    type: DataTypes.STRING,
                },
                url: {
                    type: DataTypes.STRING,
                },
                userName: {
                    type: DataTypes.STRING,
                },
                referral: {
                    type: DataTypes.STRING,
                },
                description: {
                    type: DataTypes.STRING,
                },
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

const Sequelize = require('sequelize');

module.exports = class Payments extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                platform_user: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: 'PlatformUsers',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                amount: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                method: {
                    type: DataTypes.ENUM('card', 'TRC20', 'ERC20'),
                    allowNull: false,
                },
                pay_method: {
                    type: DataTypes.ENUM('payin', 'payout'),
                    allowNull: false,
                },
                wallet_address: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                card_number: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.ENUM('processing', 'approved', 'declined'),
                    allowNull: false,
                    defaultValue: 'processing',
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                sequelize,
                timestamps: true,
                freezeTableName: true,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.PlatformUsers, {
            foreignKey: 'platform_user',
            as: 'platformUser',
        });
    }
};

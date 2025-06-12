const Sequelize = require('sequelize');

module.exports = class Leads extends Sequelize.Model {
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
                },
                phone: {
                    type: DataTypes.STRING,
                    defaultValue: null
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                language: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                affiliate: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                    references: {
                        model: 'Affiliates',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                manager: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                comment: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Comments',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                status: {
                    type: Sequelize.ENUM(
                        'new',
                        'no answer',
                        'newer answer',
                        'slip away',
                        'not interested',
                        'no pot',
                        'callback',
                        'reassign',
                        'active',
                        'depositor',
                        'initial call',
                        'wrong info',
                        'invalid language'
                    ), defaultValue: 'new',
                    allowNull: true,

                }

            },
            {
                sequelize,
                timestamps: false,
                freezeTableName: true
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Affiliates, {
            foreignKey: 'affiliate',
            as: "affiliateData"
        });
        this.belongsTo(models.Users, {
            foreignKey: 'manager',
            as: "user"
        });
        this.belongsTo(models.Comments, {
            foreignKey: 'comment',
            as: "lastComment"
        });
        this.hasOne(models.PlatformUsers, {
            foreignKey: 'lead_id',
            as: 'platformUser'
        });
    }
};

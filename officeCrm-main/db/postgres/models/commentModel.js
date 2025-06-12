const Sequelize = require('sequelize');

module.exports = class Comments extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                message: {
                    type: DataTypes.STRING(500),
                    allowNull: false
                },
                user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                lead: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Leads',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
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
        this.belongsTo(models.Users, {
            foreignKey: 'user',
            as: "userData"
        });
    }
};

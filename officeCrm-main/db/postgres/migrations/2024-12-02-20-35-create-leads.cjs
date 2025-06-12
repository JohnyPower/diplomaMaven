module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Leads', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                defaultValue: null,
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            language: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            affiliate: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'Affiliates',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            manager: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            comment: {
                type: Sequelize.INTEGER,
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
                    'depositor'
                ),
                defaultValue: 'new',
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('Leads');
    },
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Payments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            platform_user: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'PlatformUsers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            amount: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            method: {
                type: Sequelize.ENUM('card', 'TRC20', 'ERC20'),
                allowNull: false,
            },
            pay_method: {
                type: Sequelize.ENUM('payin', 'payout'),
                allowNull: false,
            },
            wallet_address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            card_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('processing', 'approved', 'declined'),
                allowNull: false,
                defaultValue: 'processing'
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
        await queryInterface.dropTable('Payments');
    },
};

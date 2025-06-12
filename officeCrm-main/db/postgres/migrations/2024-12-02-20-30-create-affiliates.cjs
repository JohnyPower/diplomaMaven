module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Affiliates', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
            },
            offerName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            offer: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            referral: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Affiliates');
    },
};


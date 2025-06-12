module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('PlatformUsers', 'balance', {
            type: Sequelize.FLOAT,
            defaultValue: 0
        });
        await queryInterface.addColumn('PlatformUsers', 'owner', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id',
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('PlatformUsers', 'balance');
        await queryInterface.removeColumn('PlatformUsers', 'owner');
    },
};


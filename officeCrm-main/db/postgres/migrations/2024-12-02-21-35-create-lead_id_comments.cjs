module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Comments', 'lead', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Leads',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Comments', 'lead');
    },
};

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.sequelize.query(`
            ALTER TYPE "enum_Leads_status" ADD VALUE 'wrong number';
        `);
    },

    down: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query(`
                CREATE TYPE "enum_Leads_status_new" AS ENUM (
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
                    'invalid language',
                );
            `, {transaction});

            await queryInterface.sequelize.query(`
                ALTER TABLE "Leads"
                ALTER
                COLUMN "status" TYPE "enum_Leads_status_new"
                USING "status"::text::"enum_Leads_status_new";
            `, {transaction});

            await queryInterface.sequelize.query(`
                DROP TYPE "enum_Leads_status";
            `, {transaction});

            await queryInterface.sequelize.query(`
                ALTER TYPE "enum_Leads_status_new" RENAME TO "enum_Leads_status";
            `, {transaction});
        });
    },
};

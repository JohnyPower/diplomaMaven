const cron = require('node-cron');
const {sequelize} = require('../../db/postgres/models');
cron.schedule('* * * * *', async () => {
    try {
        console.log('Завдання оновлення profit розпочато...');

        await sequelize.models.Positions.update(
            {
                profit: sequelize.literal('"amount" * (RANDOM() * (0.25 - 0.1) + 0.1)')
            },
            {
                where: {
                    isActive: true,
                }
            }
        );

        console.log('Оновлення profit завершено.');
    } catch (error) {
        console.error('Помилка під час оновлення profit:', error);
    }
});

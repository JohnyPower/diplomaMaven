const helper = require('../../../app/helpers/helper');
const {Sequelize} = require("sequelize");

const position = {
    get: async (connection, options, user) => {
        const position = await connection.Positions.findOne({
            where: {
                id: options.positionId,
                userId: user.id
            },
            include: [{
                required: false,
                model: connection.Pairs,
                as: "pair",
            }],
            attributes: {exclude: ['createdAt', 'updatedAt', 'pairId']}
        });

        return {
            success: true,
            result: {
                position
            }
        };
    },

    all: async (connection, user) => {
        const positions = await connection.Positions.findAll({
            where: {userId: user.id},
            include: [{
                required: false,
                model: connection.Pairs,
                as: "pair",
            }],
            attributes: {exclude: ['updatedAt', 'pairId']}
        });

        return {
            success: true,
            result: {
                positions
            }
        };
    },

    post: async (connection, options, user) => {
        const createPosition = async (pairData, userId, amount) => {
            let enterPrice;

            switch (pairData.type) {
                case 'forex':
                    const [fromCurrency, toCurrency] = pairData.pair.split('/');
                    enterPrice = await helper.forex.getExchangeRate(fromCurrency, toCurrency);
                    break;
                case 'crypto':
                    const pair = pairData.pair.replace('/', '');
                    enterPrice = await helper.binance.getExchangeRate(pair);
                    break;
                case 'stock':
                    enterPrice = await helper.stock.getExchangeRate(pairData.pair);
                    break;
            }

            await connection.Positions.create({
                ...options,
                id: helper.math.generateNumericUUID(),
                userId,
                enterPrice,
                currentPrice: enterPrice,
                profit: amount * 0.1
            });
        };

        let platformUserId = user.id;

        if (user.type === 'head' || user.type === 'shift' || user.type === 'teamLead') {
            const platformUser = await connection.PlatformUsers.findOne({
                where: { id: options.platformUserId }
            });

            if (!platformUser || (platformUser.owner !== user.id && user.type === 'teamLead')) {
                return helper.doom.error.accessDenied();
            }

            platformUserId = options.platformUserId;
        }

        const platformUser = await connection.PlatformUsers.findOne({
            where: { id: platformUserId }
        });

        if (!platformUser || platformUser.balance < options.amount) {
            return helper.doom.error.balanceIsLess();
        }

        const pairData = await connection.Pairs.findOne({
            where: { id: options.pairId }
        });

        if (!pairData) {
            return helper.doom.error.pairNotFound();
        }

        await createPosition(pairData, platformUserId, options.amount);

        return {
            success: true,
            result: {
                message: 'Positions successfully created'
            }
        };
    },

    put: async (connection, options, user) => {
        const position = await connection.Positions.findOne({where: {id: options.positionId}});

        if (!position) {
            return helper.doom.error.positionNotFound();
        }

        await position.update(options);

        if (options.isActive === false) {
            await connection.PlatformUsers.update(
                {balance: Sequelize.literal(`balance + ${position.profit}`)},
                {where: {id: user.id}}
            );
        }

        return {
            success: true,
            result: {
                message: 'Position was successfully updated'
            }
        };
    },

    delete: async (connection, options, user) => {
        const result = await connection.Positions.destroy({
            where: {
                id: options.positionId,
                userId: user.id
            }
        });

        if (result === 0) {
            return {
                success: false,
                result: {message: 'Position does not exist'}
            };
        }

        return {
            success: true,
            result: {message: 'Position successfully deleted'}
        };
    }
};

module.exports = position;

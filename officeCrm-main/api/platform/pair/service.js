const helper = require('../../../app/helpers/helper');
const {Sequelize} = require("sequelize");

const position = {
    get: async (connection, options, user) => {
        const pair = await connection.Pairs.findOne({
            where: {
                id: options.pairId,
            }
        });

        return {
            success: true,
            result: {
                pair
            }
        };
    },

    all: async (connection, options, user) => {
        const limit = options.limit || 10;
        const offset = options.page ? (options.page - 1) * limit : 0;

        const {count, rows: pairs} = await connection.Pairs.findAndCountAll({
            limit,
            offset
        });

        return {
            success: true,
            result: {
                total: count,
                totalPages: Math.ceil(count / limit),
                pairs,
            }
        };
    },

    post: async (connection, options, user) => {
        return {
            success: true,
            result: {
                message: 'Pair successfully created'
            }
        };
    },

    delete: async (connection, options, user) => {
        const result = await connection.Pairs.destroy({
            where: {
                id: options.pairId,
            }
        });

        if (result === 0) {
            return {
                success: false,
                result: {message: 'Pair does not exist'}
            };
        }

        return {
            success: true,
            result: {message: 'Pair successfully deleted'}
        };
    }
};

module.exports = position;

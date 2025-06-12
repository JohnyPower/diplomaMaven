const helper = require('../../../app/helpers/helper');

const affiliate = {
    get: async (connection, options) => {
        const affiliate = await connection.Affiliates.findOne({
            where: {id: options.affiliateId},
        });

        return {
            success: true,
            result: {
                affiliate
            }
        };
    },

    all: async (connection, options) => {
        const searchParams = {};

        const affiliates = await connection.Affiliates.findAll({
            limit: options.limit || 10,
            offset: options.page ? (options.page - 1) * options.limit : 0,
            order: [['createdAt', 'DESC']],
        });

        return {
            success: true,
            result: {
                affiliates
            }
        };
    },

    post: async (connection, options) => {
        await connection.Affiliates.create({
            id: helper.math.generateNumericUUID(),
            ...options,
        });

        return {
            success: true,
            result: {
                message: 'Affiliate successfully created'
            }
        };
    },

    put: async (connection, options) => {
        await connection.Affiliates.update({...options}, {
            where: {id: options.affiliateId},
        })

        return {
            success: true,
            result: {
                message: 'Affiliate was successfully updated'
            }
        };
    },

    delete: async (connection, options) => {
        await connection.Affiliates.destroy({where: {id: options.affiliateId}})

        return {
            success: true,
            result: {message: 'Affiliate was successfully deleted'}
        };
    }
};

module.exports = affiliate;

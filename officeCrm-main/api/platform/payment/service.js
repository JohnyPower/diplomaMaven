const helper = require('../../../app/helpers/helper');
const {Sequelize, Op} = require("sequelize");

const position = {
    all: async (connection, options, user) => {
        const limit = options.limit || 10;
        const offset = options.page ? (options.page - 1) * limit : 0;

        const {count, rows: payments} = await connection.Payments.findAndCountAll({
            limit,
            offset
        });

        return {
            success: true,
            result: {
                total: count,
                totalPages: Math.ceil(count / limit),
                payments,
            }
        };
    },

    put: async (connection, options, user) => {
        if (user.type === 'head' || user.type === 'shift') {
            await connection.Payments.update({status: options.status}, {
                where: {id: options.paymentId},
            });
        }

        if (user.type === 'teamLead') {
            const data = await connection.Payments.findOne({
                where: {id: options.paymentId},
                include: [
                    {
                        required: false,
                        model: connection.PlatformUsers,
                        as: "platformUser",
                        include: [
                            {
                                required: false,
                                model: connection.Leads,
                                as: "leadData",
                            }
                        ]
                    }
                ]
            })
            const manager = data.platformUser.leadData.manager
            const users = await connection.Users.findAll({
                where: {
                    group: user.group,
                    type: {[Op.or]: ["user", "teamLead"]}
                }
            });
            const userIds = users.map(u => u.id);
            const isManagerInGroup = userIds.includes(manager);

            if (!isManagerInGroup) return helper.doom.error.accessDenied()
            await connection.Payments.update({status: options.status}, {
                where: {id: options.paymentId},
            });
        }

        return {
            success: true,
            result: {
                message: 'Payment status successfully updated'
            }
        };
    },

    post: async (connection, options, user) => {
        if (user.type === process.env.PLATFORM_USER_TYPE) {
            if (options.pay_method === 'payout') {
                if (!options.wallet_address && !options.card_number) {
                    return helper.doom.error.addressOrCardNotFound()
                }
            }

            await connection.Payments.create({
                ...options,
                platform_user: user.id
            });
        }
        return {
            success: true,
            result: {
                message: 'Payments successfully created'
            }
        };
    },

};

module.exports = position;

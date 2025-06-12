const helper = require('../../../app/helpers/helper');
const {Op} = require("sequelize");
const {Sequelize} = require("../../../db/postgres/models");

const lead = {
        get: async (connection, options, user) => {
            const lead = await connection.Leads.findOne({
                where: {id: options.leadId},
                attributes: {
                    include: ["createdAt"]
                },
                include: [
                    {
                        required: false,
                        model: connection.Comments,
                        as: "lastComment",
                        attributes: ['id', 'message', 'createdAt']
                    },
                    {
                        required: false,
                        model: connection.Affiliates,
                        as: "affiliateData",
                    },
                    {
                        required: false,
                        model: connection.Users,
                        as: "user",
                        attributes: {exclude: ['password', 'refresh_token']},
                    },
                    {
                        required: false,
                        model: connection.PlatformUsers,
                        as: "platformUser",
                        include: [
                            {
                                required: false,
                                model: connection.Positions,
                                as: "positions",
                                // attributes: ['id', 'pairId', 'enterPrice', 'amount', 'type', 'profit', 'isActive'],
                            },
                            {
                                required: false,
                                model: connection.Payments,
                                as: "payments",
                            },

                        ],
                    }
                ]
            });

            if (!lead) return helper.doom.error.leadNotFound();

            if (user.type === 'teamLead') {
                const users = await connection.Users.findAll({
                    where: {
                        group: user.group,
                        type: {[Op.or]: ["user", "teamLead"]}
                    }
                });
                const userIds = users.map(u => u.id);
                const isManagerInGroup = userIds.includes(lead.manager);

                if (!isManagerInGroup) return helper.doom.error.accessDenied()
            }

            if (user.type === 'user' && lead.manager !== user.id) return helper.doom.error.accessDenied()

            return {
                success: true,
                result: {
                    lead
                }
            };
        },

        getCountryAndLanguage: async (connection, options) => {
            let countries = [];
            let languages = [];

            if (options.country) {
                const countryRecords = await connection.Leads.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country']]
                });
                countries = countryRecords.map(record => record.country);
            }

            if (options.language) {
                const languageRecords = await connection.Leads.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('language')), 'language']]
                });
                languages = languageRecords.map(record => record.language);
            }

            return {
                success: true,
                result: {
                    countries: countries || [],
                    languages: languages || []
                }
            };
        },


        all: async (connection, options, user) => {
            const dateRange = options.dateRange || [];
            const where = {};

            if (options.status) where.status = options.status;
            if (options.country) where.country = options.country;
            if (options.language) where.language = options.language;
            if (options.managerId) where.manager = options.managerId;

            if (dateRange.length === 2) {
                where.createdAt = {
                    [Op.gte]: dateRange[0],
                    [Op.lte]: dateRange[1].split('T')[0].concat('T23:59:59.999Z')
                };
            }

            const limit = options.limit || 10;
            const offset = options.page ? (options.page - 1) * limit : 0;
            const defaultAttributes = {
                exclude: ['affiliate', 'manager', 'comment'],
                include: ["createdAt"]
            };
            const defaultInclude = [
                {
                    required: false,
                    model: connection.Comments,
                    as: "lastComment",
                    attributes: ['id', 'message', 'createdAt']
                },
                {
                    required: false,
                    model: connection.Users,
                    as: "user",
                    attributes: {exclude: ['password', 'refresh_token']},
                },
                {
                    required: false,
                    model: connection.Affiliates,
                    as: "affiliateData",
                },
            ];

            if (user.type === 'head' || user.type === 'shift') {

            }

            if (user.type === 'teamLead') {
                const users = await connection.Users.findAll({
                    where: {
                        group: user.group,
                        type: {[Op.or]: ["user", "teamLead"]}
                    }
                });

                const teamLeadUsers = users.map(u => u.id);

                if (!where.manager) {
                    where.manager = {[Op.in]: teamLeadUsers};
                } else if (!teamLeadUsers.includes(where.manager)) {
                    return helper.doom.error.managerNotFound();
                }

            }

            if (user.type === 'user') {
                where.manager = user.id;

            }

            if (user.type === 'buyer') {
                where.affiliate = options.affiliateId;
            }

            const order = [];

            if (options.sortBy === 'createdAt') {
                order.push(['createdAt', options.sortOrder === 'ASC' ? 'ASC' : 'DESC']);
            } else {
                order.push(['createdAt', 'DESC']);
            }

            if (options.sortBy === 'lastComment' && options.sortOrder) {
                order.unshift([
                    {model: connection.Comments, as: 'lastComment'},
                    'createdAt',
                    options.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
                ]);
            }

            const {count, rows: leads} = await connection.Leads.findAndCountAll({
                where,
                attributes: defaultAttributes,
                include: defaultInclude,
                limit,
                offset,
                order,
            });

            return {
                success: true,
                result: {
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    leads,
                },
            };
        },

        post: async (connection, options) => {
            if (options.country && helper.country[options.country.toUpperCase()]) {
                options.country = helper.country[options.country.toUpperCase()];
            }
            if (options.language && helper.language[options.language.toUpperCase()]) {
                options.language = helper.language[options.language.toUpperCase()];
            }

            const lead = await connection.Leads.create({
                ...options,
            });

            return {
                success: true,
                result: {
                    lead
                }
            };
        },

        put: async (connection, options, user) => {
            let updateOptions = {};
            let shouldUpdate = false;

            const isSingleLead = options.leadIds.length === 1;

            switch (user.type) {
                case 'head':
                case 'shift':
                    updateOptions = {...options};
                    shouldUpdate = true;
                    break;
                case 'teamLead':
                    if (options.manager) {
                        const teamLeadManagers = await connection.Users.findAll({
                            where: {group: user.group},
                            attributes: ['id'],
                        });
                        const managerIds = teamLeadManagers.map(({id}) => id);
                        if (!managerIds.includes(options.manager)) {
                            return helper.doom.error.managerNotFound()
                        }
                        updateOptions.manager = options.manager;

                    }
                    if (options.status) updateOptions.status = options.status;

                    shouldUpdate = true;
                    break;
                case 'user':
                    if (options.status) {
                        updateOptions = {status: options.status};
                        shouldUpdate = true;
                    }
                    break;
            }

            if (shouldUpdate) {
                if (isSingleLead) {
                    await connection.Leads.update(updateOptions, {where: {id: options.leadIds[0]}});
                } else {
                    if (updateOptions.manager)
                        await connection.Leads.update(updateOptions, {where: {id: options.leadIds}});
                }
            }

            return {
                success: true,
                result: {
                    message: 'Lead was successfully updated',
                },
            };
        },


        delete: async (connection, options, user) => {
            const lead = await connection.Leads.findOne({
                where: {
                    id: options.leadId
                }
            })
            if (!lead) return helper.doom.error.leadNotFound();


            if ((user.type === 'user' || user.type === 'teamLead') && lead.manager !== user.id) {
                return helper.doom.error.accessDenied();
            }

            await lead.destroy();

            return {
                success: true,
                result: {message: 'Lead was successfully deleted'}
            };
        }
    }
;

module.exports = lead;

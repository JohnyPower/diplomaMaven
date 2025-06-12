const Joi = require('joi');

const schemas = {
    router: {
        get: Joi.object()
            .keys({
                leadId: Joi.number().required()
            }),
        getCountryAndLanguage: Joi.object()
            .keys({
                country: Joi.boolean().default(true).optional(),
                language: Joi.string().default(true).optional(),
            }),
        all: Joi.object()
            .keys({
                affiliateId: Joi.number().optional(),
                limit: Joi.number().optional(),
                page: Joi.number().optional(),
                status: Joi.string().valid(
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
                    'wrong number'
                ).optional(),
                country: Joi.string().optional(),
                language: Joi.string().optional(),
                managerId: Joi.number().integer().optional(),
                sortBy: Joi.string().optional(),
                sortOrder: Joi.string().optional(),
                dateRange: Joi.array()
                    .items(Joi.string().isoDate())
                    .length(2)
                    .optional()
            }),
        post: Joi.object()
            .keys({
                userName: Joi.string().required(),
                email: Joi.string().required(),
                phone: Joi.string().allow(null),
                country: Joi.string().required(),
                language: Joi.string().required(),
                affiliate: Joi.number().integer().required(),
                manager: Joi.number().integer().required(),
                comment: Joi.number().integer().allow(null),
                status: Joi.string().valid(
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
                    'wrong number'
                ).default('new')
            })
            .required(),

        put: Joi.object()
            .keys({
                leadIds: Joi.array()
                    .items(Joi.number())
                    .required(),
                userName: Joi.string().optional(),
                country: Joi.string().optional(),
                language: Joi.string().optional(),
                affiliate: Joi.number().integer().optional(),
                manager: Joi.number().integer().optional(),
                comment: Joi.number().integer().allow(null).optional(),
                status: Joi.string().valid(
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
                    'wrong number'
                ).optional()
            })
            .required(),

        delete: Joi.object()
            .keys({
                leadId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

const Joi = require('joi');

const schemas = {
    router: {
        get: Joi.object()
            .keys({
                affiliateId: Joi.number().required()
            }),
        all: Joi.object()
            .keys({
                limit: Joi.number().optional(),
                page: Joi.number().optional()
            }),
        post: Joi.object()
            .keys({
                offerName: Joi.string().required(),
                offer: Joi.string().required(),
                url: Joi.string().uri().optional(),
                userName: Joi.string().optional(),
                referral: Joi.string().optional(),
                description: Joi.string().max(255).optional(),
            })
            .required(),
        put: Joi.object()
            .keys({
                affiliateId: Joi.number().required(),
                offerName: Joi.string().optional(),
                offer: Joi.string().optional(),
                url: Joi.string().uri().optional(),
                userName: Joi.string().optional(),
                referral: Joi.string().optional(),
                description: Joi.string().max(255).optional(),
            })
            .required(),
        delete: Joi.object()
            .keys({
                affiliateId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

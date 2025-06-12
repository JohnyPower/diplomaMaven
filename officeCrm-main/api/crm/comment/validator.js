const Joi = require('joi');

const schemas = {
    router: {
        all: Joi.object()
            .keys({
                leadId: Joi.number().required(),
                limit: Joi.number().optional(),
                page: Joi.number().optional()
            }),
        post: Joi.object()
            .keys({
                message: Joi.string().required(),
                leadId: Joi.number().required(),
            }).required(),

        put: Joi.object()
            .keys({
                message: Joi.string().required(),
                commentId: Joi.number().required(),
            }).required(),

        delete: Joi.object()
            .keys({
                commentId: Joi.number().required(),
            }).required()
    }
};

module.exports = {
    schemas
};

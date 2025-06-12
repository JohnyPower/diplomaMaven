const Joi = require('joi');

const schemas = {
    router: {
        get: Joi.object()
            .keys({
                groupId: Joi.number().required()
            }),
        all: Joi.object()
            .keys({
                limit: Joi.number().optional(),
                page: Joi.number().optional()
            }),
        post: Joi.object()
            .keys({
                name: Joi.string().required(),
            })
            .required(),
        put: Joi.object()
            .keys({
                groupId: Joi.number().required(),
                name: Joi.string().required()
            })
            .required(),
        delete: Joi.object()
            .keys({
                groupId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

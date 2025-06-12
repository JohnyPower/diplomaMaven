const Joi = require('joi');
const bcrypt = require("bcryptjs");

const schemas = {
    router: {
        get: Joi.object()
            .keys({
                pairId: Joi.number().required(),
            })
            .required(),
        all: Joi.object()
            .keys({
                limit: Joi.number().optional(),
                page: Joi.number().optional(),
            }).optional(),
        post: Joi.object()
            .keys({})
            .required(),
        delete: Joi.object()
            .keys({
                pairId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

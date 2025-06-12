const Joi = require('joi');

const schemas = {
    router: {
        registration: Joi.object()
            .keys({
                userName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                group: Joi.number().required(),
                type: Joi.string()
                    .valid('head', 'shift', 'teamLead', 'user')
                    .default('user'),
            })
            .required(),
        putUser: Joi.object()
            .keys({
                userId: Joi.number().optional(),
                email: Joi.string().email().optional(),
                group: Joi.string()
                    .valid('sales', 'reten', 'buyer').optional(),
                userName: Joi.string().optional(),
                password: Joi.string().optional(),
            })
            .required(),

        deleteUser: Joi.object()
            .keys({
                userId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

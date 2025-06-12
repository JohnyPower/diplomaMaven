const Joi = require('joi');

const schemas = {
    router: {
        login: Joi.object()
            .keys({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

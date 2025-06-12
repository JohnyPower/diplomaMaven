const Joi = require('joi');
const bcrypt = require("bcryptjs");

const schemas = {
    router: {
        get: Joi.object()
            .keys({
                positionId: Joi.number().required(),
            })
            .required(),
        post: Joi.object()
            .keys({
                pairId: Joi.number().integer().required(),
                // enterPrice: Joi.number().required(),
                amount: Joi.number().required(),
                takeProfit: Joi.string().optional(),
                stopLoss: Joi.string().optional(),
                type: Joi.string().valid('sell', 'buy').required(),
                platformUserId: Joi.number().optional(),
            })
            .required(),
        put: Joi.object()
            .keys({
                positionId: Joi.number().required(),
                takeProfit: Joi.string().optional(),
                stopLoss: Joi.string().optional(),
                enterPrice: Joi.number().optional(),
                currentPrice: Joi.number().optional(),
                profit: Joi.string().optional(),
                isActive: Joi.boolean().optional()
            })
            .required(),
        delete: Joi.object()
            .keys({
                positionId: Joi.number().required()
            })
            .required()
    }
};

module.exports = {
    schemas
};

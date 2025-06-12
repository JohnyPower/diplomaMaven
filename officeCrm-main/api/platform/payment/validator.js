const Joi = require('joi');
const bcrypt = require("bcryptjs");

const schemas = {
    router: {
        all: Joi.object()
            .keys({
                limit: Joi.number().optional(),
                page: Joi.number().optional(),
            }).optional(),
        put: Joi.object()
            .keys({
                paymentId: Joi.number().required(),
                status: Joi.string().valid('processing', 'approved', 'declined').required(),
            })
            .required(),
        post: Joi.object()
            .keys({
                amount: Joi.number().required(),
                method: Joi.string().valid('card', 'TRC20', 'ERC20').required(),
                pay_method: Joi.string().valid('payin', 'payout').required(),
                wallet_address: Joi.string().optional(),
                card_number: Joi.string().optional(),
            })
            .required()
    }
};

module.exports = {
    schemas
};

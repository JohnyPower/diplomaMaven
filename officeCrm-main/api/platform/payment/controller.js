const service = require('./service');
const {controller} = require('../../../app/helpers/helper');
const {StatusCodes} = require('http-status-codes');

const pair = {
    all: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.all(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },

    put: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.put(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },

    post: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.post(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },



};

module.exports = pair;

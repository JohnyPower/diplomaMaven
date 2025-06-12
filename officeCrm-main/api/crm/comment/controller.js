const service = require('./service');
const {controller} = require('../../../app/helpers/helper');
const {StatusCodes} = require('http-status-codes');

const comment = {
    all: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.all(connection, req.options);
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

    put: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.put(connection, req.options);
            },
            StatusCodes.OK
        );
    },

    delete: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.delete(connection, req.options);
            },
            StatusCodes.OK
        );
    }


};

module.exports = comment;

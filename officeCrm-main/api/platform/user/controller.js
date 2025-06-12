const service = require('./service');
const {controller} = require('../../../app/helpers/helper');
const {StatusCodes} = require('http-status-codes');

const user = {
    get: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.get(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },

    registration: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.registration(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },

    putUser: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.putUser(connection, req.options, req.user);
            },
            StatusCodes.OK
        );
    },

    deleteUser: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.deleteUser(connection, req.options);
            },
            StatusCodes.OK
        );
    }


};

module.exports = user;

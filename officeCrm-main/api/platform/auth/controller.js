const service = require('./service');
const {controller} = require('../../../app/helpers/helper');
const {StatusCodes} = require('http-status-codes');

const auth = {
    login: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                return await service.login(connection, req.options);
            },
            StatusCodes.OK
        );
    },

    logout: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                const refreshToken = req.headers.update.slice(req.headers.update.indexOf('=') + 1);

                return await service.logout(connection, refreshToken);
            },
            StatusCodes.OK
        );
    },

    refresh: async (req, res) => {
        await controller.sendJson(
            res,
            async (connection) => {
                const refreshToken = req.headers.update.slice(req.headers.update.indexOf('=') + 1);

                return await service.refresh(connection, refreshToken);
            },
            StatusCodes.OK
        );
    }
};

module.exports = auth;

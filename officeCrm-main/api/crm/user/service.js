const bcrypt = require('bcryptjs');

const helper = require('../../../app/helpers/helper');

const user = {
    get: async (connection, user) => {
        const userData = await connection.Users.findOne({
            where: {id: user.id},
            attributes: {exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt']}
        });

        return {
            success: true,
            result: {
                user: userData
            }
        };
    },

    all: async (connection, user) => {
        let users;
        if (user.type === 'head' || user.type === 'shift') {
            users = await connection.Users.findAll({
                attributes: {exclude: ['password', 'refresh_token', 'updatedAt']}
            });
        }

        if (user.type === 'teamLead') {
            users = await connection.Users.findAll({
                where: {group: user.group},
                attributes: {exclude: ['password', 'refresh_token', 'updatedAt']}
            });
        }

        console.log(users)
        return {
            success: true,
            result: {
                user: users
            }
        };
    },

    registration: async (connection, options) => {
        const candidate = await connection.Users.findOne({
            where: {email: options.email}
        });
        if (candidate) {
            return helper.doom.error.emailAlreadyRegistered();
        }

        const hashPassword = await bcrypt.hash(options.password, 10);

        console.log(options)
        await connection.Users.create({
            ...options,
            password: hashPassword
        });

        return {
            success: true,
            result: {
                message: 'User successfully created'
            }
        };
    },

    putUser: async (connection, options) => {
        const user = await connection.Users.findOne({
            where: {id: options.userId}
        });

        if (!user) {
            return helper.doom.error.accountNotFound();
        }

        if (options.password) options.password = await bcrypt.hash(options.password, 10);

        await user.update(options);

        return {
            success: true,
            result: {
                message: 'User was successfully updated'
            }
        };

    },

    deleteUser: async (connection, options) => {
        const existingUser = await connection.Users.findOne({where: {id: options.userId}});

        if (!existingUser) {
            return {
                success: false,
                result: {message: 'User does not exist'}
            };
        }

        await connection.Users.destroy({where: {id: options.userId}})

        return {
            success: true,
            result: {message: 'User was successfully deleted'}
        };

    }
};

module.exports = user;

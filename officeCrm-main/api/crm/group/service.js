const group = {
    get: async (connection, options) => {
        const group = await connection.Groups.findOne({
            where: {id: options.groupId},
        });

        return {
            success: true,
            result: {
                group
            }
        };
    },

    all: async (connection, options) => {
        const searchParams = {};

        const groups = await connection.Groups.findAll({
            limit: options.limit || 10,
            offset: options.page? (options.page  - 1) * options.limit : 0,
            order: [['createdAt', 'DESC']],
        });

        return {
            success: true,
            result: {
                groups
            }
        };
    },

    post: async (connection, options) => {
        await connection.Groups.create({
            ...options,
        });

        return {
            success: true,
            result: {
                message: 'Group successfully created'
            }
        };
    },

    put: async (connection, options) => {

        await connection.Groups.update({...options}, {
            where: {id: options.groupId},
        })

        return {
            success: true,
            result: {
                message: 'Groups was successfully updated'
            }
        };

    },

    delete: async (connection, options) => {
        await connection.Groups.destroy({where: {id: options.groupId}})

        return {
            success: true,
            result: {message: 'Groups was successfully deleted'}
        };

    }
};

module.exports = group;

const comment = {
    all: async (connection, options) => {
        const comments = await connection.Comments.findAll({
            where: {
                lead: options.leadId
            },
            include: [{
                required: false,
                model: connection.Users,
                as: "userData",
                attributes: ['id', 'userName', 'email']
            }],
            attributes: ['id', 'message', 'createdAt'],
            limit: options.limit || 50,
            offset: options.page ? (options.page - 1) * options.limit : 0,
            order: [['createdAt', 'DESC']],
        });


        return {
            success: true,
            result: {
                comments
            }
        };
    },

    post: async (connection, options, user) => {
        const newComment = await connection.Comments.create({
            message: options.message,
            lead: options.leadId,
            user: user.id
        });

        await connection.Leads.update({
            comment: newComment.id
        }, {
            where: {id: options.leadId},
        })

        return {
            success: true,
            result: {
                message: 'Comments successfully created'
            }
        };
    },

    put: async (connection, options) => {
        await connection.Comments.update({...options}, {
            where: {id: options.commentId},
        })

        return {
            success: true,
            result: {
                message: 'Comments was successfully updated'
            }
        };
    },

    delete: async (connection, options) => {
        await connection.Comments.destroy({where: {id: options.commentId}})

        return {
            success: true,
            result: {message: 'Comments was successfully deleted'}
        };
    }
};

module.exports = comment;

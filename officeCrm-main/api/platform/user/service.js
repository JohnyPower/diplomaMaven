const bcrypt = require('bcryptjs');
const helper = require('../../../app/helpers/helper');

const user = {
    get: async (connection, options, user) => {
        const whereClause = options.leadId ?
            {lead_id: options.leadId} :
            (user.type === process.env.PLATFORM_USER_TYPE && !options.leadId)
                ? {id: user.id}
                : null;

        if (!whereClause) {
            return helper.doom.error.accessDenied();
        }

        const userData = await connection.PlatformUsers.findOne({
            where: whereClause,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']},
            include: [
                {
                    model: connection.Positions,
                    as: 'positions',
                    required: false
                }
            ]
        });


        return {
            success: true,
            result: {
                user: userData
            }
        };
    },

    registration: async (connection, options, user) => {
        const lead = await connection.Leads.findOne({
            where: {id: options.leadId}
        })

        if (!lead) {
            return helper.doom.error.leadNotFound();
        }

        if (user.type === 'head' || user.type === 'shift' || user.type === 'teamLead') {
            const userPassword = helper.math.generatePassword();

            const platformUser = await connection.PlatformUsers.create({
                id: helper.math.generateNumericUUID(),
                firstName: lead.userName.split(' ')[0] ?? '',
                lastName: lead.userName.split(' ')[1] ?? '',
                email: lead.email,
                country: lead.country,
                phone: lead.phone,
                password: await bcrypt.hash(userPassword, 10),
                lead_id: options.leadId,
                owner: user.id
            });
            return {
                success: true,
                result: {
                    platformUser,
                    userPassword,
                    message: 'User successfully created',
                }
            };
        } else {
            return helper.doom.error.accessDenied()
        }
    },

    putUser: async (connection, options, user) => {
        const platformUser = await connection.PlatformUsers.findOne({
            where: {id: user.id}
        });

        if (!platformUser) {
            return helper.doom.error.accountNotFound();
        }

        await platformUser.update(options);

        return {
            success: true,
            result: {
                message: 'User was successfully updated'
            }
        };

    },

    deleteUser:
        async (connection, options) => {
            const result = await connection.PlatformUsers.destroy({
                where: {
                    id: options.userId
                }
            });

            if (result === 0) {
                return {
                    success: false,
                    result: {message: 'User does not exist'}
                };
            }

            return {
                success: true,
                result: {message: 'User was successfully deleted'}
            };

        }
};

module.exports = user;

const {StatusCodes} = require('http-status-codes');

const errorCode = {
    validation: 100,
    tokenNotFound: 110,
    tokenNotValid: 111,
    tokenExpired: 112,
    emailAlreadyRegistered: 119,
    walletAddressNameAlreadyExist: 120,
    walletAddressAlreadyExist: 121,
    walletAddressIsNotValid: 122,
    emailNotFound: 123,
    passwordNotValid: 130,
    adminRights: 135,
    accountNotFound: 140,
    leadNotFound: 141,
    positionNotFound: 142,
    addressOrCardNotFound: 143,
    balanceIsLess: 143,
    accountNotConfirmed: 150,
    accountWasBlocked: 151,
    accessDenied: 403,
    pairNotFound: 152
};

const error = {
    validation: (res, error) => {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: error.message.replace(/"/g, ''),
            error: 'Bad request',
            errorCode: errorCode.validation
        });
    },

    tokenNotFound: (res) => {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'To pass the identification, we need a token.',
            error: 'Token not found',
            errorCode: errorCode.tokenNotFound
        });
    },

    pairNotFound: (from, to) => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: `Pair ${from} / ${to} not found`,
            error: 'Pair not found',
            errorCode: errorCode.pairNotFound
        };
    },

    tokenNotValid: (res) => {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Token failed validation.',
            error: 'Unauthorized access',
            errorCode: errorCode.tokenNotValid
        });
    },

    tokenExpired: (res) => {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Token lifetime expired.',
            error: 'Unauthorized access',
            errorCode: errorCode.tokenExpired
        });
    },

    adminRights: (res) => {
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: 'You dont have administrator rights',
            error: 'You dont have administrator rights',
            errorCode: errorCode.adminRights
        });
    },

    emailAlreadyRegistered: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'This email is already registered.',
            error: 'Conflict',
            errorCode: errorCode.emailAlreadyRegistered
        };
    },

    emailNotFound: (email) => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: `This email: '${email}' is not found.`,
            error: 'Access Denied',
            errorCode: errorCode.emailNotFound
        };
    },

    wrongEmailOrPassword: () => {
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Wrong email or password',
            error: 'Access Denied',
            errorCode: errorCode.passwordNotValid
        };
    },

    accountNotFound: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'Account was not found.',
            error: 'Account not found',
            errorCode: errorCode.accountNotFound
        };
    },
    managerNotFound: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'Manager was not found.',
            error: 'Manager not found',
            errorCode: errorCode.accountNotFound
        };
    },
    leadNotFound: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'Lead was not found.',
            error: 'Lead not found',
            errorCode: errorCode.leadNotFound
        };
    },
    positionNotFound: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'Position was not found.',
            error: 'Position not found',
            errorCode: errorCode.positionNotFound
        };
    },

    addressOrCardNotFound: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'You need type wallet address or card number for pay out',
            error: 'You need type wallet address or card number for pay out',
            errorCode: errorCode.addressOrCardNotFound
        };
    },

    balanceIsLess: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'The amount on your balance is less than the transaction amount',
            error: 'The amount on your balance is less than the transaction amount',
            errorCode: errorCode.balanceIsLess
        };
    },

    Unauthorized: () => {
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Refresh token not found',
            error: 'Refresh token not found. User is not exist',
            errorCode: errorCode.tokenNotFound
        };
    },

    walletAddressNameAlreadyExist: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'This wallet address name is already exist on this page.',
            error: 'Conflict',
            errorCode: errorCode.walletAddressNameAlreadyExist
        };
    },

    walletAddressAlreadyExist: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'This wallet address is already exist on this page.',
            error: 'Conflict',
            errorCode: errorCode.walletAddressAlreadyExist
        };
    },

    walletAddressIsNotValid: () => {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: 'This wallet address is not valid.',
            error: 'Not found',
            errorCode: errorCode.walletAddressIsNotValid
        };
    },

    adminHasNotConfirmed: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'Admin has not yet confirmed your account',
            error: 'Conflict',
            errorCode: errorCode.accountNotConfirmed
        };
    },

    adminBlockedYourAccount: () => {
        return {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: 'Admin blocked your account',
            error: 'Conflict',
            errorCode: errorCode.accountWasBlocked
        };
    },

    accessDenied: () => {
        return {
            statusCode: StatusCodes.FORBIDDEN,
            success: false,
            message: 'Access denied: you do not manage this lead',
            error: 'FORBIDDEN',
            errorCode: errorCode.accessDenied
        };
    }
};

module.exports = {
    errorCode,
    error
};

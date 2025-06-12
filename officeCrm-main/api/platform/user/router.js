const {validator, middlewares} = require('../../../app/helpers/helper');
const {schemas} = require('./validator');
const express = require('express');
const router = express.Router({});
const asyncHandler = require('express-async-handler');
const controller = require('./controller');

router.post(
    '/create',
    validator.main(schemas.router.registration),
    asyncHandler(middlewares.auth.user),
    asyncHandler(controller.registration)
);

router.get('/',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.get),
    asyncHandler(controller.get));

router.put('/',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.putUser),
    asyncHandler(controller.putUser)
);

router.delete('/',
    // asyncHandler(middlewares.auth.admin),
    validator.main(schemas.router.deleteUser),
    asyncHandler(controller.deleteUser)
);
module.exports = router;

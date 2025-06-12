const {validator, middlewares} = require('../../../app/helpers/helper');
const {schemas} = require('./validator');
const express = require('express');
const router = express.Router({});
const asyncHandler = require('express-async-handler');
const controller = require('./controller');

router.post(
    '/create-user',
    validator.main(schemas.router.registration),
    asyncHandler(middlewares.auth.admin),
    asyncHandler(controller.registration)
);

router.get('/', asyncHandler(middlewares.auth.user), asyncHandler(controller.get));

router.get('/all',
    asyncHandler(middlewares.auth.user),
    asyncHandler(controller.all));

router.put(
    '/put-user',
    asyncHandler(middlewares.auth.admin),
    validator.main(schemas.router.putUser),
    asyncHandler(controller.putUser)
);

router.delete(
    '/delete-user',
    asyncHandler(middlewares.auth.admin),
    validator.main(schemas.router.deleteUser),
    asyncHandler(controller.deleteUser)
);
module.exports = router;

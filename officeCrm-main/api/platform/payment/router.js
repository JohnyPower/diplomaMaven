const {validator, middlewares} = require('../../../app/helpers/helper');
const {schemas} = require('./validator');
const express = require('express');
const router = express.Router({});
const asyncHandler = require('express-async-handler');
const controller = require('./controller');

router.get(
    '/all',
    validator.main(schemas.router.all),
    asyncHandler(middlewares.auth.admin),
    asyncHandler(controller.all)
);

router.put(
    '/',
    validator.main(schemas.router.put),
    asyncHandler(middlewares.auth.user),
    asyncHandler(controller.put)
);

router.post('/',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.post),
    asyncHandler(controller.post)
);


module.exports = router;

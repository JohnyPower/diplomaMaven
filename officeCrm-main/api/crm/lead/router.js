const {validator, middlewares} = require('../../../app/helpers/helper');
const {schemas} = require('./validator');
const express = require('express');
const router = express.Router({});
const asyncHandler = require('express-async-handler');
const controller = require('./controller');

router.get('/',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.get),
    asyncHandler(controller.get));

router.get('/country-and-language',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.getCountryAndLanguage),
    asyncHandler(controller.getCountryAndLanguage));

router.get('/all',
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.all),
    asyncHandler(controller.all));

router.post('/',
    validator.main(schemas.router.post),
    // asyncHandler(middlewares.auth.user),
    asyncHandler(controller.post)
);

router.put('/',
    // asyncHandler(middlewares.auth.admin),
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.put),
    asyncHandler(controller.put)
);

router.delete('/',
    // asyncHandler(middlewares.auth.admin),
    asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.delete),
    asyncHandler(controller.delete)
);
module.exports = router;

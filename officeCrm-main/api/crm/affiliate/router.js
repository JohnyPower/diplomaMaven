const {validator, middlewares} = require('../../../app/helpers/helper');
const {schemas} = require('./validator');
const express = require('express');
const router = express.Router({});
const asyncHandler = require('express-async-handler');
const controller = require('./controller');

router.get('/',
    // asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.get),
    asyncHandler(controller.get));

router.get('/all',
    // asyncHandler(middlewares.auth.user),
    validator.main(schemas.router.all),
    asyncHandler(controller.all));

router.post('/',
    validator.main(schemas.router.post),
    asyncHandler(controller.post)
);

router.put('/',
    // asyncHandler(middlewares.auth.admin),
    asyncHandler(controller.put)
);

router.delete('/',
    validator.main(schemas.router.delete),
    asyncHandler(controller.delete)
);
module.exports = router;

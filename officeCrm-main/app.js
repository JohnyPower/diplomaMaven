const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { header, middlewares } = require('./app/helpers/helper');
const router = require('./app/router');
require('./app/cron/updateProfit');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(header);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(middlewares.cors);

router.api(app);

app.use(middlewares.notFound);
app.use(middlewares.error);

module.exports = app;

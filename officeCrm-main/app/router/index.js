const auth = require('../../api/crm/auth/router');
const user = require('../../api/crm/user/router');
const lead = require('../../api/crm/lead/router');
const affiliate = require('../../api/crm/affiliate/router');
const group = require('../../api/crm/group/router');
const comment = require('../../api/crm/comment/router');

const platformUser = require('../../api/platform/user/router');
const platformAuth = require('../../api/platform/auth/router');
const platformPosition = require('../../api/platform/position/router');
const pairPosition = require('../../api/platform/pair/router');
const payment = require('../../api/platform/payment/router');

module.exports = {
    api: (app) => {
        app.use('/user', user);
        app.use('/auth', auth);
        app.use('/lead', lead);
        app.use('/affiliate', affiliate);
        app.use('/group', group);
        app.use('/comment', comment);
        // ****************** PLATFORM **********************
        app.use('/platform/user', platformUser);
        app.use('/platform/auth', platformAuth);
        app.use('/platform/position', platformPosition);
        app.use('/platform/pair', pairPosition);
        app.use('/platform/payment', payment);
    }
};

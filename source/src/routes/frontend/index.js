const express = require('express')
const router = express.Router();
const getdataMiddleware = require('../../middleware/data_nonload')
const UserInfoMiddleware = require('../../middleware/get_user_info')

router.use(async (req, res, next) => {
    req.app.set('layout', 'frontend/index.ejs');
    next();
});

router.use('/' ,getdataMiddleware, UserInfoMiddleware, require('./home'))

module.exports = router
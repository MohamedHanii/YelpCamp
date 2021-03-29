const express = require('express');
const router = express.Router();
const user = require('../controller/userController')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

router.route('/register')
    .get(user.viewRegister)
    .post(catchAsync(user.register));


router.route('/login')
    .get(user.viewLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);


router.get('/logout', user.logout)

module.exports = router;
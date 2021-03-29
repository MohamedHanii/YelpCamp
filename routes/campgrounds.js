const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const campground = require('../controller/campgroundController');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware/middleware');


router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, validateCampground, catchAsync(campground.create))


router.get('/new', isLoggedIn, campground.new);

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn, validateCampground, isAuthor, catchAsync(campground.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.destroy))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm));



module.exports = router;
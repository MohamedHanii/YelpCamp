const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controller/campgroundController');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware/middleware');

/**
 * Routes for campgrounds starting with prefix '/campgrounds/'
 */


router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.create))


router.get('/new', isLoggedIn, campground.new);

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.destroy))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm));



module.exports = router;
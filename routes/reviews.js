const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const review = require('../controller/reviewController');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware');

/**
 * Routes for reviews starting with prefix '/campgrounds/:id/reviews/'
 */

router.post('/', isLoggedIn, validateReview, catchAsync(review.create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.destroy));

module.exports = router;
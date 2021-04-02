/**
* holds all middleware that used inside 
* user, reviews, campground routes
 */

const { campgroundSchema, reviewSchema } = require('../JoiHelper')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');


/**
 * middleware for checking if there is user login
 * by using isAuthenticated() function from passportJS
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

/**
 * middleware for check if information of campground is valid
 * by using Joi Package we have validate function that we send
 * the req.body params to it so it can validate it 
 * if error found show error else continue the next page
 */
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * middleware for check if information of campground is valid
 * by using Joi Package we have validate function that we send
 * the req.body params to it so it can validate it 
 * if error found show error else continue the next page
 */
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 *  middleware for check if the user inside session is the same user
 * that creates that campground by checking campground.author with
 *  the req.user._id if they are the same call next function
 * else restrict the action and redirect user back
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that! ");
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}



/**
 *  middleware for check if the user inside session is the same user
 * that creates that review by checking review.author with
 *  the req.user._id if they are the same call next function
 * else restrict the action and redirect user back
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that! ");
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

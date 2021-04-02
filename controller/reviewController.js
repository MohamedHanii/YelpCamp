

/**
 * Controller holds the logic for all review routes
 * including Show, create, Update, Delete reviews
*/

const Campground = require('../models/campground');
const Review = require("../models/review");



/**
 * holds logic for creation a new review
 * starting by get the campground with id from url
 * create a new reviews
 * push review to campground and save campground
 * redirect back to show page
 */
module.exports.create = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'New review has been created');
    res.redirect(`/campgrounds/${campground._id}`);
}

/**
 * holds logic for deletion review
 * get review from the id inside url
 * find it and delete 
 * also pull the reviews from campground
 */
module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`)
}

/**
 * Controller holds the logic for all campground routes
 * including Show, create, Update, Delete Campgrounds
*/

const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


// Get all campgrounds and show them in index page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

// render create page for campground
module.exports.new = (req, res) => {
    res.render('campgrounds/new');
}

/**
 * holds the logic for submiting a new campgrounds
 * starting by get the geo-location for campground
 * follow by creating new campground with the author from session
 * then save it to database and redirect to show page
 */
module.exports.create = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Show page fro campground 
 * find campground with the id in the url 
 * then populate the reviews inside campground
 * after that populate the author inside the review
 */
module.exports.show = async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if (!campground) {
        req.flash('error', 'Can not find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

/**
 * logic for rendering edit page
 * get the campground for page with id in url
 */
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Can not find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

/**
 * Logic for updating campground
 * get the campground for page with id in url
 * update the campground with information that users enter
 * Push new images if user enter new images
 * Remove images from array and cloundinary if users select images
 * to be deleted
 * then save the campground
 */
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save()
    req.flash('success', 'Successfully update campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * logic for deleting campground
 * get the campground for page with id in url and delete it
 * then redirect to index page
 */
module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}
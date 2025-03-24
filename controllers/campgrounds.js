const Campground = require('../models/Campground');
const Booking = require('../models/Booking');
//@desc get all campgrounds
//@route GET /api/v1/campgrounds
//@access Public
exports.getCampgrounds = async (req, res, next) => {
    try{
        const campgrounds = await Campground.find();
        res.status(200).json({ success: true, count:campgrounds.length, data: campgrounds });
    } catch (err){
        res.status(400).json({ success: false, msg: err.message });
    }
};

//@desc get single campground
//@route GET /api/v1/campgrounds/:id
//@access Public
exports.getCampground = async (req, res, next) => {
    try{
        const campground = await Campground.findById(req.params.id);
        if(!campground){
            return res.status(404).json({ success: false , msg: 'Campground not found' });
        }
        res.status(200).json({ success: true, data: campground });
    } catch (err){
        res.status(400).json({ success: false, msg: err.message });
    }
};

//@desc create new campground
//@route POST /api/v1/campgrounds
//@access Private
exports.createCampground = async (req, res, next) => {
    try{
        const campground = await Campground.create(req.body);
        res.status(201).json({ success: true, data: campground });
    } catch (err){
        res.status(400).json({ success: false, msg: err.message });
    }
};

//@desc update campground
//@route PUT /api/v1/campgrounds/:id
//@access Private
exports.updateCampground = async (req, res, next) => {
    try{
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!campground){
            return res.status(404).json({ success: false , msg: 'Campground not found' });
        }

        res.status(200).json({ success: true, data: campground });
    } catch (err){
        res.status(400).json({ success: false, msg: err.message });
    }
};

//@desc delete campground
//@route DELETE /api/v1/campgrounds/:id
//@access Private
exports.deleteCampground = async (req, res, next) => {
    try{
        const campground = await Campground.findByIdAndDelete(req.params.id);

        if(!campground){
            return res.status(404).json({ success: false , msg: 'Campground not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err){
        res.status(400).json({ success: false, msg: err.message });
    }
};

//@desc add rating to campground
//@route PUT /api/v1/campgrounds/:id/rating
//@access Private
exports.addRating = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.id;  // Ensure user ID is extracted properly
        const campgroundId = req.params.id;

        // Validate that rating is between 1 and 5
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
        }

        // Ensure user has booked this campground/hotel
        const booking = await Booking.findOne({ user: userId, campground: campgroundId });

        if (!booking) {
            return res.status(403).json({ success: false, message: "You can only rate campgrounds you have booked." });
        }

        // Ensure the user has not already rated this booking
        if (booking.rated) {
            return res.status(400).json({ success: false, message: "You have already rated this hotel." });
        }

        // Find the campground/hotel
        const campground = await Campground.findById(campgroundId);

        if (!campground) {
            return res.status(404).json({ success: false, message: "Campground not found." });
        }

        // Ensure the ratings array exists before pushing
        if (!campground.ratings) {
            campground.ratings = [];
        }

        // Add the new rating, making sure user ID is correctly assigned
        const newRating = {
            user: userId,  // Ensure user ID is set
            rating: rating,
            comment: comment || ""  // Default to an empty string if no comment is provided
        };

        campground.ratings.push(newRating);

        // Recalculate the average rating
        const totalRatings = campground.ratings.length;
        const sumRatings = campground.ratings.reduce((acc, r) => acc + r.rating, 0);
        campground.avgRating = sumRatings / totalRatings;

        // Save the updated campground with the new rating
        await campground.save();

        // Mark the booking as rated
        booking.rated = true;
        await booking.save();

        res.status(200).json({ success: true, data: campground });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
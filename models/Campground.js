const mongoose = require('mongoose');
const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Address can not be more than 500 characters']
    },
    Region: {
        type: String,
        maxlength: [50, 'Region can not be more than 50 characters']
    },
    tel: {
        type: String,
        required: [true, 'Please add a phone number'],
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    picture: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                maxlength: 500
            }
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
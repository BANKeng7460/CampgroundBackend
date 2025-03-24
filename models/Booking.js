const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    campingDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    campground:{
        type:mongoose.Schema.ObjectId,
        ref:'Campground',
        required: true
    },
    nights:{
        type:Number,
        required:true
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
    rated:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model('Booking',BookingSchema);
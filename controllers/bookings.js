const Booking = require('../models/Booking');
const Campground = require('../models/Campground');
const sendConfirmationEmail = require("../utils/emailService");

//@desc     Get all booking
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings=async (req,res,next)=>{
    let query;

    //General users can see only their booking!
    if(req.user.role !== 'admin'){
        query = Booking.find({user:req.user.id}).populate({
            path:'campground',
            select:'name address tel'
        });
    }else{ //If you are an admin, you can see all!
        if(req.params.campgroundId){
            console.log(req.params.campgroundId);
            query=Booking.find({campground: req.params.campgroundId}).populate({
                path: 'campground',
                select: 'name address tel'
            });
        }else{
            query=Booking.find().populate({
                path: 'campground',
                select: 'name address tel'
            });
        }
    }
    try{
        const bookings = await query;

        res.status(200).json({
            success:true,
            count:bookings.length,
            data:bookings
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"})
    }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking=async(req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path: 'campground',
            select: 'name address tel'
        });

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});

        }

        res.status(200).json({
            success:true,
            data: booking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot find booking'});
    }
};

//@desc     Add booking
//@route    POST /api/v1/campgrounds/:campgroundId/booking
//@access   Private
exports.addBooking=async(req,res,next)=>{
    try{
        req.body.campground=req.params.campgroundId;
        
        const campground= await Campground.findById(req.params.campgroundId);
        
        if(!campground){
            return res.status(404).json({success:false,message:`No campground with the id of ${req.params.campgroundId}`});
        }
        
        //add user Id to req.body
        req.body.user=req.user.id;

        //If the user is not admin, they can only book 3 nights
        if((req.body.nights) > 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`You can't book more than 3 nights`});
        }

        //Check for existing booking
        const existedBooking=await Booking.find({user:req.user.id});

         //If the user is not admin, they can only create 3 bookings
        if(existedBooking.length >= 3&& req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} had already made 3 bookings`});
        }


        const booking = await Booking.create(req.body);

        await sendConfirmationEmail(
            req.user.email,
            req.user.name,
            campground.name,
            req.body.campingDate,
            req.body.nights
        );

        res.status(200).json({
            success:true,
            data:booking,
             message: "Booking successful! Confirmation email sent."
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot create Booking'});
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@accesss  Private
exports.updateBooking=async (req,res,next)=>{
    try{
        let booking= await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

        //Make sure user is the booking owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`User ${req.user.id} is not authorize to update this booking`});
        }

        booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: booking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot upddate Booking'});
    }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@accesss  Private
exports.deleteBooking=async (req,res,next)=>{
    try{
        let booking= await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

         //Make sure user is the booking owner
         if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorize to delete this booking`});
        }

        await booking.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot delete Booking'});
    }
};
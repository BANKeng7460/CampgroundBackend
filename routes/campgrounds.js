const express = require('express');
const {getCampgrounds,getCampground,createCampground,updateCampground,deleteCampground,addRating}
= require ('../controllers/campgrounds');

//Include other resource routers

const bookingRouter = require('./bookings');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers

router.use('/:campgroundId/bookings/',bookingRouter);


router.route('/').get(getCampgrounds).post(protect,authorize('admin'),createCampground);
router.route('/:id').get(getCampground).put(protect,authorize('admin'),updateCampground).delete(protect,authorize('admin'),deleteCampground);
router.route('/:id/rating').post(protect,authorize('admin','user'),addRating);
const app = express();
module.exports=router;
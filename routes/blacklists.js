const express = require('express');
const {ban,unban,getAllBlacklisted}= require('../controllers/blacklists');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route('/:id').get(protect,authorize('admin'),ban);
router.route('/unban/:id').get(protect,authorize('admin'),unban);
router.route('/').get(protect,authorize('admin'),getAllBlacklisted);


module.exports = router;
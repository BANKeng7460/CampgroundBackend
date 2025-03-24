const express = require('express');
const {ban,unban}= require('../controllers/blacklists');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route('/:id').get(protect,authorize('admin'),ban);
router.route('/unban/:id').get(protect,authorize('admin'),unban);

module.exports = router;
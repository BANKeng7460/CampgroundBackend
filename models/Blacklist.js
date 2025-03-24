const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
    bannerId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    bannedId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        unique: true
    },
    craeteAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blacklist',BlacklistSchema);
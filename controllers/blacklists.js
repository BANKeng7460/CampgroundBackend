const User = require('../models/User');
const Blacklist = require('../models/Blacklist');

//@desc     Set id to blacklist
//@route    GET /api/v1/blacklists/:id
//@access   Private
exports.ban = async (req, res, next) => {
    const bannedId = req.params.id;

    if (!bannedId) {
        return res.status(400).json({ success: false, message: "Need user id!" });
    }

    const bannedUser = await User.findById(bannedId);

    if (!bannedUser) {
        return res.status(400).json({ success: false, message: "Not found this user in database!" });
    }

    const bannerId = req.user._id;

    try {
        const blacklist = await Blacklist.create({
            bannerId: bannerId,
            bannedId: bannedId
        });

        res.status(200).json({ success: true, data: blacklist });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

//@desc     Unban
//@route    GET /api/v1/blacklists/unban/:id
//@access   Private
exports.unban = async (req, res, next) => {
    try {
        let unbanblacklist = await Blacklist.findById(req.params.id);

        if (!unbanblacklist) {
            return res.status(404).json({ success: false, message: `Not found blacklist with Id ${req.params.id}` });
        }

        await unbanblacklist.deleteOne();

        res.status(200).json({ success: true, data: {} });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot unban' });
    }
};

//@desc     Get all blacklisted users
//@route    GET /api/v1/blacklists
//@access   Private
exports.getAllBlacklisted = async (req, res, next) => {
    try {
        const blacklists = await Blacklist.find()
            .populate('bannerId', 'name email')   // Customize fields as needed
            .populate('bannedId', 'name email');  // Customize fields as needed

        res.status(200).json({ success: true, count: blacklists.length, data: blacklists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cannot retrieve blacklist' });
    }
};

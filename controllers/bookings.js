//@desc     Get all bookings with pagination, search, sort, and date range filter
//@route    GET /api/v1/bookings
//@access   Private (users see their own, admin sees all)
exports.getBookings = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            userSearch = '',
            sortBy = 'createdAt', // createdAt or nights
            order = 'desc',       // asc or desc
            startDate,
            endDate
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        let query = {};
        
        // 👤 Restrict to current user if not admin
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        // 📅 Date range filtering
        if (startDate || endDate) {
            query.campingDate = {};
            if (startDate) {
                query.campingDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.campingDate.$lte = new Date(endDate);
            }
        }

        // 🔍 Base query
        let baseQuery = Booking.find(query)
            .populate({
                path: 'campground',
                select: 'name address tel'
            })
            .populate({
                path: 'user',
                select: 'name email'
            })
            .sort({ [sortBy]: sortOrder });

        // 💾 Fetch all first to apply text search on populated fields
        let results = await baseQuery.lean();

        // 🔍 Search by campground name
        if (search) {
            results = results.filter(b =>
                b.campground?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 🔍 Admin only: search by user name
        if (userSearch && req.user.role === 'admin') {
            results = results.filter(b =>
                b.user?.name?.toLowerCase().includes(userSearch.toLowerCase())
            );
        }

        // 📄 Paginate
        const paginated = results.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            total: results.length,
            page: parseInt(page),
            pages: Math.ceil(results.length / limit),
            count: paginated.length,
            data: paginated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find bookings" });
    }
};

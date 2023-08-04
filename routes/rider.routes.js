const express = require(`express`);

const User = require(`../models/User`);
const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);
const protect = require(`../middlewares/protect`);

// ROUTER CONFIG
const router = express.Router();

// ROUTE PROTECTION MIDDLEWARE
router.use(protect);

// Book a ride
router.post(`/bookARide`, async (req, res) => {

    try {

        const ridersPickUpLatitude = req.body.ridersPickUpLatitude;
        const ridersPickUpLongitude = req.body.ridersPickUpLongitude;
        const ridersDestinationLatitude = req.body.ridersDestinationLatitude;
        const ridersDestinationLongitude = req.body.ridersDestinationLongitude;

        const drivers = await User.find({ isDriver: true }).select(`-password`);

        res.cookie('ridersPickUpLatitude', ridersPickUpLatitude, {
            maxAge: 1000 * 60 * 60 * 2,
            httpOnly: true
        })

        res.cookie('ridersPickUpLongitude', ridersPickUpLongitude, {
            maxAge: 1000 * 60 * 60 * 2
        })
        
        res.cookie('ridersDestinationLatitude', ridersDestinationLatitude, {
            maxAge: 1000 * 60 * 60 * 2
        })

        res.cookie('ridersDestinationLongitude', ridersDestinationLongitude, {
            maxAge: 1000 * 60 * 60 * 2
        })

        res.status(200).json({
            status: 200,
            data: {
                drivers: drivers
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;
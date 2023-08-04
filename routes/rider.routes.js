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

// Confirm ride
router.patch(`/confirmRide/:id`, async (req, res) => {

    try {

        const rider = await User.findById(req.currentUserId);
        const driver = await User.findById(req.params.id);

        if (driver.ridersRequestAccepted) {
            const message = 'This driver already accepts ride with rider.';
            return handleError(res, new ErrorResponse(400, message));
        }

        const ridersPickUpLatitude = req.cookies.ridersPickUpLatitude;
        const ridersPickUpLongitude = req.cookies.ridersPickUpLongitude;
        const ridersDestinationLatitude = req.cookies.ridersDestinationLatitude;
        const ridersDestinationLongitude = req.cookies.ridersDestinationLongitude;

        const filteredObj = {
            ridersRequest: {
                _id: rider._id,
                username: rider.username,
                ridersPickUpLatitude: ridersPickUpLatitude,
                ridersPickUpLongitude: ridersPickUpLongitude,
                ridersDestinationLatitude: ridersDestinationLatitude,
                ridersDestinationLongitude: ridersDestinationLongitude
            }
        }

        const confirmedDriver = await User.findByIdAndUpdate(req.params.id, filteredObj, {
            new: true,
            runValidators: true
        })

        confirmedDriver.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                driver: confirmedDriver
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;
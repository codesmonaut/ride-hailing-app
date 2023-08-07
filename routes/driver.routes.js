const fs = require(`fs`);
const path = require(`path`);
const express = require(`express`);
const multer = require(`multer`);

const User = require(`../models/User`);
const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);
const protect = require(`../middlewares/protect`);



// MULTER CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({ storage: storage });

const requiredDoc = [
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'driversLicense', maxCount: 1 },
    { name: 'vehicleInsAndReg', maxCount: 1 }
];



// ROUTER CONFIG
const router = express.Router();

// ROUTE PROTECTION MIDDLEWARE
router.use(protect);

// Become driver
router.patch(`/becomeDriver`, upload.fields(requiredDoc), async (req, res) => {

    try {

        const user = await User.findById(req.currentUserId);

        const filteredObj = {
            isDriver: true,
            profilePhoto: req.files['profilePhoto'][0].filename,
            driversLicense: req.files['driversLicense'][0].filename,
            vehicleInsAndReg: req.files['vehicleInsAndReg'][0].filename,
            driversLatitude: req.body.driversLatitude,
            driversLongitude: req.body.driversLongitude,
            ridersRequest: null,
            ridersRequestAccepted: false
        }

        const driver = await User.findByIdAndUpdate(req.currentUserId, filteredObj, {
            new: true,
            runValidators: true
        })

        user.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                driver: driver
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Stop being driver
router.patch(`/stopBeingDriver`, async (req, res) => {

    try {
        
        const driver = await User.findById(req.currentUserId);

        if (!driver.isDriver) {
            const message = 'You need to be a driver to perform this action';
            return handleError(res, new ErrorResponse(401, message));
        }

        fs.unlink(`./uploads/${driver.profilePhoto}`, err => {
            
            if (err) {
                console.log(err.message);
            }
        })

        fs.unlink(`./uploads/${driver.driversLicense}`, err => {

            if (err) {
                console.log(err.message);
            }
        })

        fs.unlink(`./uploads/${driver.vehicleInsAndReg}`, err => {

            if (err) {
                console.log(err.message);
            }
        })

        const filteredObj = {
            isDriver: false,
            profilePhoto: 'empty',
            driversLicense: 'empty',
            vehicleInsAndReg: 'empty',
            driversLatitude: null,
            driversLongitude: null,
            ridersRequest: null,
            ridersRequestAccepted: false
        }

        const user = await User.findByIdAndUpdate(req.currentUserId, filteredObj, {
            new: true,
            runValidators: true
        })

        user.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                user: user
            }
        })

    } catch (err) {
        handleError(res, err);
    }
})

// Stop driving
router.patch(`/stopDriving`, async (req, res) => {

    try {

        const driver = await User.findById(req.currentUserId);

        if (!driver.isDriver) {
            const message = 'Only driver can stop driving';
            return handleError(res, new ErrorResponse(400, message));
        }

        const filteredObj = {
            driversLatitude: null,
            driversLongitude: null
        }

        const driverWhoStopsDrivning = await User.findByIdAndUpdate(req.currentUserId, filteredObj, {
            new: true,
            runValidators: true
        })

        driverWhoStopsDrivning.password = undefined;

        res.status(200).json({
            status: 200,
            driver: driverWhoStopsDrivning
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Continue driving
router.patch(`/continueDriving`, async (req, res) => {

    try {

        const driver = await User.findById(req.currentUserId);

        if (!driver.isDriver) {
            const message = 'Only driver can continue driving.';
            return handleError(res, new ErrorResponse(400, message));
        }

        const filteredObj = {
            driversLatitude: req.body.driversLatitude,
            driversLongitude: req.body.driversLongitude
        }

        const driverWhoContinuesDriving = await User.findByIdAndUpdate(req.currentUserId, filteredObj, {
            new: true,
            runValidators: true
        })

        driverWhoContinuesDriving.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                driver: driverWhoContinuesDriving
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Accept riders request
router.patch(`/acceptRidersRequest`, async (req, res) => {

    try {

        const filteredObjForDriver = {
            ridersRequestAccepted: true
        }

        const driver = await User.findByIdAndUpdate(req.currentUserId, filteredObjForDriver, {
            new: true,
            runValidators: true
        })

        const filteredObjForRider = {
            rideRequestAccepted: true
        }

        const rider = await User.findByIdAndUpdate(driver.ridersRequest._id, filteredObjForRider, {
            new: true,
            runValidators: true
        })

        driver.password = undefined;
        rider.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                driver: driver,
                rider: rider
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Finish ride
router.patch(`/finishRide`, async (req, res) => {

    try {

        const driver = await User.findById(req.currentUserId);

        const filteredObjForRider = {
            rideRequestAccepted: false
        }

        const rider = await User.findByIdAndUpdate(driver.ridersRequest._id, filteredObjForRider, {
            new: true,
            runValidators: true
        })

        const filteredObjForDriver = {
            ridersRequest: {},
            ridersRequestAccepted: false
        }

        const driverWhoFinishedRide = await User.findByIdAndUpdate(req.currentUserId, filteredObjForDriver, {
            new: true,
            runValidators: true
        })

        rider.password = undefined;
        driverWhoFinishedRide.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                driver: driverWhoFinishedRide,
                rider: rider
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Play driving tutorial
router.get(`/drivingTutorial`, async (req, res) => {

    try {

        const videoPath = `${__dirname}/../video/driving_tutorial.mp4`;

        res.set('content-type', 'video/mp4');
        res.set('accept-ranges', 'bytes');

        fs.createReadStream(videoPath).pipe(res);
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;
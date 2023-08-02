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

// Signing for driver
router.patch(`/signingForDriver`, upload.fields(requiredDoc), async (req, res) => {

    try {

        const user = await User.findById(req.currentUserId);

        const filteredObj = {
            isDriver: true,
            profilePhoto: req.files['profilePhoto'][0].filename,
            driversLicense: req.files['driversLicense'][0].filename,
            vehicleInsAndReg: req.files['vehicleInsAndReg'][0].filename,
            driversLatitude: req.body.driversLatitude,
            driversLongitude: req.body.driversLongitude
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

module.exports = router;
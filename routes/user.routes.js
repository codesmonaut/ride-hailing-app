const express = require(`express`);

const User = require(`../models/User`);
const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);
const protect = require(`../middlewares/protect`);

// ROUTER CONFIG
const router = express.Router();

// ROUTE PROTECTION MIDDLEWARE
router.use(protect);

// Get account
router.get(`/account`, async (req, res) => {

    try {

        const account = await User.findById(req.currentUserId);

        account.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                user: account
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Update account
router.patch(`/updateAccount`, async (req, res) => {

    try {

        if (req.body.password) {
            const message = 'You can change password only on api/v1/auth/changePassword route.';
            return handleError(res, new ErrorResponse(401, message));
        }

        const filteredObj = {
            username: req.body.username
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

module.exports = router;
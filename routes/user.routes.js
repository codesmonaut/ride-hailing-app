const express = require(`express`);

const User = require(`../models/User`);
const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);
const protect = require(`../middlewares/protect`);
const restrict = require(`../middlewares/restrict`);

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

// Create account
router.post(`/createAccount`, async (req, res) => {

    try {

        const message = 'If you want to create new user, please use /api/v1/auth/register route instead.';

        res.status(200).json({
            status: 200,
            msg: message
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

// Delete account
router.delete(`/deleteAccount`, async (req, res) => {

    try {

        const account = await User.findById(req.currentUserId);

        if (account.isDriver) {
            const message = 'You need first to stop being a driver in order to delete account.';
            return handleError(res, new ErrorResponse(400, message));
        }

        await User.findByIdAndDelete(req.currentUserId);

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

// ROUTE RESTRICTION MIDDLEWARE
router.use(restrict);

// Get all users
router.get(`/`, async (req, res) => {

    try {
        
        const users = await User.find();

        res.status(200).json({
            status: 200,
            results: users.length,
            data: {
                users: users
            }
        })

    } catch (err) {
        handleError(res, err);
    }
})

// Get one user
router.get(`/:id`, async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

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

// Create user
router.post(`/`, async (req, res) => {

    try {

        const message = 'If you want to create new user, please use /api/v1/auth/register route instead.';
        
        res.status(200).json({
            status: 200,
            msg: message
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Update user
router.patch(`/:id`, async (req, res) => {

    try {

        if (req.body.password) {
            const message = 'It is not allowed to change password on this route.';
            return handleError(res, new ErrorResponse(401, message));
        }

        if (req.body.isDriver) {
            const message = 'Only user himself can become driver.';
            return handleError(res, new ErrorResponse(401, message));
        }

        const filteredObj = {
            username: req.body.username,
            email: req.body.email,
            isAdmin: req.body.isAdmin
        }

        const user = await User.findByIdAndUpdate(req.params.id, filteredObj, {
            new: true,
            runValidators: true
        })

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

// Delete user
router.delete(`/:id`, async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;
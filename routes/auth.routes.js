const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const rateLimit = require(`express-rate-limit`);

const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);
const User = require(`../models/User`);
const loginLimit = require(`../config/loginLimit`);
const protect = require(`../middlewares/protect`);

// ROUTER CONFIG
const router = express.Router();

// Register
router.post(`/register`, async (req, res) => {

    try {
        
        if (req.body.password !== req.body.passwordConfirm) {
            const message = 'Password and password confirm must match.'
            return handleError(res, new ErrorResponse(400, message));
        }

        const filteredObj = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        const newUser = await User.create(filteredObj);

        const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE
        })

        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * process.env.ACCESS_TOKEN_COOKIE_EXPIRE_DATE,
            httpOnly: true
        })

        newUser.password = undefined;

        res.status(201).json({
            status: 201,
            data: {
                user: newUser
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Login
router.post(`/login`, rateLimit(loginLimit), async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });

        if (!user) {
            const message = 'Email or password or both are incorrect.';
            return handleError(res, new ErrorResponse(401, message));
        }

        const match = await User.comparePasswords(password, user.password);

        if (!match) {
            const message = 'Email or password or both are incorrect.';
            return handleError(res, new ErrorResponse(401, message));
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE
        })

        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * process.env.ACCESS_TOKEN_COOKIE_EXPIRE_DATE,
            httpOnly: true
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

// Logout
router.get(`/logout`, async (req, res) => {

    try {

        res.cookie('token', 'loggedOut', {
            maxAge: 1,
            httpOnly: true
        })

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

// Forgot password
router.post(`/forgotPassword`, async (req, res) => {

    try {

        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            const message = 'The email is incorrect or the user does not exist.';
            return handleError(res, new ErrorResponse(400, message));
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET_KEY, {
            algorithm: process.env.RESET_TOKEN_ALGORITHM,
            expiresIn: process.env.RESET_TOKEN_EXPIRE_DATE
        })

        const link = `${process.env.BASE_URL}${process.env.PORT}/api/v1/auth/resetPassword/${resetToken}`;

        console.log(link);

        res.status(200).json({
            status: 200,
            msg: 'Link should be sent to your email account.'
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Reset password
router.post(`/resetPassword/:token`, async (req, res) => {

    try {

        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        if (password !== passwordConfirm) {
            const message = 'Password and password confirm must match.';
            return handleError(res, new ErrorResponse(400, message));
        }

        const resetToken = req.params.token;

        const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET_KEY);

        const user = await User.findById(decoded.id);

        user.password = password;
        await user.save();

        user.password = undefined;

        res.status(200).json({
            status: 200,
            msg: 'Password reset successfully.'
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Change password
router.post(`/changePassword`, protect, async (req, res) => {

    try {

        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        if (password !== passwordConfirm) {
            const message = 'Password and password confirm must match.';
            return handleError(res, new ErrorResponse(400, message));
        }

        const user = await User.findById(req.currentUserId);

        user.password = password;
        await user.save();

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
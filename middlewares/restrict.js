const User = require(`../models/User`);

const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);

const restrict = async (req, res, next) => {
    const user = await User.findById(req.currentUserId);

    if (!user.isAdmin) {
        const message = 'You are not authorized to perform this action.';
        return handleError(res, new ErrorResponse(401, message));
    }

    next();
}

module.exports = restrict;
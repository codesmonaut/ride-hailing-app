const jwt = require(`jsonwebtoken`);

const ErrorResponse = require(`../util/ErrorResponse`);
const handleError = require(`../util/handleError`);

const protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        const message = 'You need to login in order to proceed.';
        return handleError(res, new ErrorResponse(401, message));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {

        if (err) {
            console.log(err.message);
        }

        if (decoded) {
            req.currentUserId = decoded.id;
            next();
        }
    })
}

module.exports = protect;
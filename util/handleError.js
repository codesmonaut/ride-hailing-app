const ErrorResponse = require(`../util/ErrorResponse`);

const handleError = (res, err) => {
    let error = {...err};
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(404, message);
    }

    if (err.code === 11000) {
        const message = 'There is a duplicate of inputed value in the database.';
        error = new ErrorResponse(400, message);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(400, message);
    }

    res.status(error.statusCode || 500).json({
        status: error.statusCode || 500,
        msg: error.message || 'It looks like there is an error on the server.'
    })
}

module.exports = handleError;
const handleError = (res, err) => {
    let error = {...err};
    error.message = err.message;

    res.status(error.statusCode || 500).json({
        status: error.statusCode || 500,
        msg: error.message || 'It looks like there is an error on the server.'
    })
}

module.exports = handleError;
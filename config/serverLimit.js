const serverLimit = {
    windowMs: 1000 * 60 * 60,
    max: 100,
    message: 'That is too many requests from the same IP. Try again in an hour.'
}

module.exports = serverLimit;
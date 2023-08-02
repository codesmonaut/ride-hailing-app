const loginLimit = {
    windowMs: 1000 * 60 * 60,
    max: 3,
    message: 'Too many login attempts. Try again in an hour.'
}

module.exports = loginLimit;
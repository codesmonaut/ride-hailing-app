const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User must have a username.'],
        minlength: [2, 'Username must have more than 2 characters.'],
        maxlength: [30, 'Username must have less than 30 characters.']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Email must be valid.'],
        required: [true, 'User must have an email.'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'User must have a password.'],
        minlength: [8, 'Password must have more than 8 characters.'],
        maxlength: [50, 'Password must have less than 50 characters.']
    },
    rideRequestAccepted: {
        type: Boolean,
        default: false
    },
    isDriver: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String,
        required: function () {
            
            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    driversLicense: {
        type: String,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    vehicleInsAndReg: {
        type: String,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    driversLatitude: {
        type: Number,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    driversLongitude: {
        type: Number,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    ridersRequest: {
        type: Object,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    ridersRequestAccepted: {
        type: Boolean,
        required: function () {

            if (this.isDriver) {
                return true;
            }

            if (!this.isDriver) {
                return false;
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.comparePasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
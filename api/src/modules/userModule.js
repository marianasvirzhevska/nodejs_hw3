const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    birthday: Date,
    created: {
        type: Date,
        default: Date.now(),
    },
    role: String,
    password: String,
    password_repeat: String,
});

const UserModel = mongoose.model('User', userSchema);

const userValidateSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(12).required(),
    created: Joi.date().max('1-1-2050').iso(),
    role: Joi.string().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,10}$/).required(),
    password_repeat: Joi.ref('password'),
});

module.exports = {
    UserModel,
    userValidateSchema,
};

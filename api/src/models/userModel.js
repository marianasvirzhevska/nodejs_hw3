const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const ObjectID = require('mongodb').ObjectID;

const userSchema = new mongoose.Schema({
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
    assigned_load: {
        type: String,
        default: null,
    },
});

const UserModel = mongoose.model('User', userSchema);

const passPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

const firstName = Joi.string().min(2).max(30);
const lastName = Joi.string().min(2).max(30);
const email = Joi.string().email();
const phone = Joi.string().min(10).max(12);
const created = Joi.date().max('1-1-2050').iso();
const role = Joi.string();
const password = Joi.string().pattern(passPattern);
const assignedLoad = Joi.string();

const userValidateSchema = Joi.object({
    firstName: firstName.required(),
    lastName: lastName.required(),
    email: email.required(),
    phone: phone.required(),
    created: created,
    role: role.required(),
    password: password.required(),
    password_repeat: Joi.ref('password'),
    assigned_load: assignedLoad,
});

const userUpdateSchema = Joi.object({
    firstName: Joi.string().min(2).max(30),
    lastName: Joi.string().min(2).max(30),
    phone: Joi.string().max(12),
    role: role,
});

const userPassSchema = Joi.object({
    password: password.required(),
    password_repeat: Joi.ref('password'),
});

function findUser(query) {
    return UserModel.find(query);
};

function findUserById(userId) {
    return UserModel.findById(userId);
};

function updateUser(userId, doc) {
    return UserModel.updateOne({ _id: new ObjectID(userId) }, { $set: doc });
};

module.exports = {
    UserModel,
    userUpdateSchema,
    userValidateSchema,
    userPassSchema,
    findUser,
    findUserById,
    updateUser,
};

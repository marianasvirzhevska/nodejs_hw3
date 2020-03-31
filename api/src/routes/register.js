const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const secret = config.get('secret');
const {
    UserModel,
    userValidateSchema,
    findUser,
} = require('../models/userModel');
const errorHandler = require('../api/errorHandler');

router.post('/register', (req, res) => {
    const user = req.body;

    const { value, error } = userValidateSchema.validate(user);

    if (error) {
        const errors = error.details;
        res.json(errors);
        return;
    }

    const dbUser = new UserModel(value);
    const { email, password } = dbUser;

    findUser({ email })
        .then((user) => {
            if (user.length) {
                errorHandler('Email address already in use', res, null, 401);
                return;
            }

            bcrypt.hash(password, 10, (err, hash) => {
                dbUser.password = hash;

                if (err) {
                    errorHandler('Error occurred. Try again later', res, err);
                    return;
                }

                dbUser.save((err) => {
                    if (err) {
                        errorHandler('Error occurred. Try again later', res, err);
                    } else {
                        const user = {
                            firstName: dbUser.firstName,
                            lastName: dbUser.lastName,
                            role: dbUser.role,
                            id: dbUser._id,
                        };

                        const userToken = jwt.sign(user, secret);

                        res.json({ status: 'User successfully created', user: userToken });
                    }
                    res.end();
                });
            });
        });
});

module.exports = router;

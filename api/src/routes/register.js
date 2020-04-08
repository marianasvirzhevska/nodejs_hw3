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

router.post('/api/auth/register', (req, res) => {
    const reqUser = req.body;
    const user = {
        email: reqUser.username,
        password: reqUser.password,
        role: reqUser.role,
    };

    const { value, error } = userValidateSchema.validate(user);

    if (error) {
        const errors = error.details;
        res.status(403).json(errors);
        return;
    }

    const dbUser = new UserModel(value);
    const { email, password } = dbUser;
    dbUser.password_repeat = undefined;

    findUser({ email })
        .then((user) => {
            if (user.length) {
                errorHandler('Email address already in use', res, null, 403);
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
                            assigned_load: dbUser.assigned_load,
                            assigned_truck: dbUser.assigned_truck,
                        };

                        const userToken = jwt.sign(user, secret);

                        res.json({ status: 'User registered successfully.', token: userToken });
                    }
                    res.end();
                });
            });
        });
});

module.exports = router;

const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const secret = config.get('secret');
const { findUser } = require('../models/userModel');
const errorHandler = require('../api/errorHandler');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    findUser({ email })
        .then(([ user ]) => {
            if (!user) {
                errorHandler('Email doesn\'t exist.', res, null, 403);
                return;
            };

            bcrypt.compare(password, user.password)
                .then((isValid) => {
                    if (isValid) {
                        const authUser = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            id: user._id,
                        };

                        const userToken = jwt.sign(authUser, secret);

                        res.json({ status: 'User successfully logged in.', user: userToken });
                        res.end();
                    } else {
                        errorHandler('Wrong password.', res, null, 403);
                    }
                });
        })
        .catch((err) => errorHandler('Server error.', res, err));
});

module.exports = router;

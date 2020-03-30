const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const secret = config.get('secret');
const { UserModel } = require('../models/userModel');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    UserModel.find({ email })
        .then(([ user ]) => {
            if (!user) {
                res.status(400).json({ status: 'Email doesn\'t exist.' });
                res.end();
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
                        res.status(400).json({ status: 'Wrong password.' });
                        res.end();
                    }
                });
        })
        .catch((err) => console.error('Error: ', err));
});

module.exports = router;

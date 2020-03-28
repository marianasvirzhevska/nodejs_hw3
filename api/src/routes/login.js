const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const secret = config.get('secret');
const { UserModel } = require('../modules/userModule');

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
                            email: user.email,
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

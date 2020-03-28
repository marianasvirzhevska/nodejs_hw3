const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const secret = config.get('secret');
const {
    UserModel,
    userValidateSchema,
} = require('../modules/userModule');

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

    UserModel.find({ email })
        .then((user) => {
            if (user.length) {
                res.status(400).json({ status: 'Email address already in use' });
                res.end();
                return;
            }
            bcrypt.hash(password, 10, (err, hash) => {
                dbUser.password = hash;

                if (err) {
                    res.status(500).json({ status: 'Error occurred. Try again later' });
                    res.end();
                    throw err;
                }

                dbUser.save((err) => {
                    if (err) {
                        res.status(400).json({ status: 'Error occurred. Try again later' });
                        throw err;
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

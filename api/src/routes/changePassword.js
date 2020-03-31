const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { userPassSchema, updateUser } = require('../models/userModel');
const errorHandler = require('../api/errorHandler');

router.put('/change-pass', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const { password, password_repeat: passRepeat } = req.body;
        const validatePass = {
            password,
            password_repeat: passRepeat,
        };

        const { value, error } = userPassSchema.validate(validatePass);

        if (error) {
            errorHandler('Password didn\'t mutch', res, error);
            return;
        }

        bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                errorHandler('Error occurred. Try again later', res, err);
                return;
            }

            updateUser(user.id, { password: hash })
                .then(() => {
                    res.json({ status: 'Password changed.' });
                    res.end();
                })
                .catch((err) => {
                    errorHandler('Error. Try again later.', res, err);
                });
        });
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const objectID = require('mongodb').ObjectID;
const router = express.Router();
const { UserModel, userPassSchema } = require('../models/userModel');

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
            console.error(error);
            res.status(500).json({ status: 'Password didn\'t mutch' });
            res.end();
            return;
        }

        bcrypt.hash(validatePass.password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({ status: 'Error occurred. Try again later' });
                res.end();
                throw err;
            }

            UserModel.updateOne({ _id: objectID(user.id) }, { $set: { password: hash } })
                .then((raw) => {
                    res.json({ status: 'Password changed.' });
                    res.end();
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ status: 'Error. Try again later.' });
                    res.end();
                });
        });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { UserModel, userUpdateSchema } = require('../models/userModel');
const objectID = require('mongodb').ObjectID;

router.get('/profile', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const { id } = user;

        UserModel.findById(id, (err, dbUser) => {
            if (err) {
                console.error(err);

                res.status(500).json({ status: 'User info not found.' });
                res.end();
            }

            const userInfo = {
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                role: dbUser.role,
                email: dbUser.email,
                phone: dbUser.phone,
            };

            res.json({ status: 'Ok', userInfo });
            res.end();
        });
    }
});

router.put('/profile', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const update = req.body;
        const { id } = user;
        const { value, error } = userUpdateSchema.validate(update);

        if (error) {
            console.error(err);
            res.status(500).json({ status: 'Error. Try again later.' });
            res.end();
        } else {
            UserModel.updateOne({ _id: objectID(id) }, { $set: value })
                .then((raw) => {
                    res.json({ status: 'User profile edited.' });
                    res.end();
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ status: 'Error. Try again later.' });
                    res.end();
                });
        }
    }
});

module.exports = router;

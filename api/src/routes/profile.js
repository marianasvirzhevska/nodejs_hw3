const express = require('express');
const router = express.Router();
const {
    userUpdateSchema,
    findUserById,
    updateUser,
    deleteUser,
} = require('../models/userModel');
const errorHandler = require('../api/errorHandler');
const validateShipper = require('../api/validateShipper');

router.get('/api/profile', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const { id } = user;

        findUserById(id)
            .then((dbUser) => {
                const userInfo = {
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                    role: dbUser.role,
                    email: dbUser.email,
                    phone: dbUser.phone,
                    assigned_load: dbUser.assigned_load,
                    assigned_truck: dbUser.assigned_truck,
                    _id: dbUser._id,
                };

                res.json({ status: 'Ok', userInfo });
                res.end();
            })
            .catch((err) => errorHandler('User info not found.', res, err));
    }
});

router.put('/api/profile', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const update = req.body;
        const { id } = user;
        const { value, error } = userUpdateSchema.validate(update);

        if (error) {
            errorHandler('Error. Try again later.', res, error);
        } else {
            updateUser(id, value)
                .then(() => {
                    res.json({ status: 'User profile edited.' });
                    res.end();
                })
                .catch((err) => {
                    errorHandler('Error. Try again later.', res, err);
                });
        }
    }
});

router.delete('/api/profile', (req, res) =>{
    const user = req.user;
    const isValid = validateShipper(user);

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        if (isValid) {
            deleteUser(user.id)
                .then(() => {
                    res.json({ status: 'User profile deleted.' });
                    res.end();
                })
                .catch((err) => errorHandler('Error. Try again later.', res, err));
        } else {
            errorHandler('User role: Driver. Profile deleting is not permitted.', res, err);
        }
    }
});

module.exports = router;

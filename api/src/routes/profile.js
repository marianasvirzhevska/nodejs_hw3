const express = require('express');
const config = require('config');
const router = express.Router();
const { UserModel } = require('../modules/userModule');

router.get('/profile', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const { email } = user;

        UserModel.find({ email })
            .then(([ user ]) => {
                const userInfo = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    email: user.email,
                    phone: user.phone,
                };

                res.json({ userInfo });
                res.end();
            })
            .catch((err) => {
                console.error('Error: ', err);

                res.status(500).json({ status: 'User info not found' });
                res.end();
            });
    }
});

module.exports = router;

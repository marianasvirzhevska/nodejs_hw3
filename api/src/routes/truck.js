const express = require('express');
const router = express.Router();
const {
    TruckModel,
    truckValidateSchema,
} = require('../models/truckModel');

router.post('/truck', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const { id } = user;
        const { type, name } = req.body;

        const truck = {
            created_by: id,
            type,
            name,
        };

        const { value, error } = truckValidateSchema.validate(truck);

        if (error) {
            const errors = error.details;
            res.json(errors);
            res.end();
            return;
        }

        const dbTruck = new TruckModel(value);

        dbTruck.save((err) => {
            if (err) {
                res.status(500).json({ status: 'Error occurred. Try again later' });
                res.end();
                throw err;
            } else {
                res.json({ status: 'Truck successfully created', dbTruck });
                res.end();
            }
        });
    }
});

router.get('/truck', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        // const { id } = user;

        TruckModel.find({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    res.json({ status: 'No trucks found.' });
                    res.end();
                    return;
                };

                res.json({ status: 'Ok', trucks });
                res.end();
            })
            .catch((err) => console.error(err));
    }
});

module.exports = router;

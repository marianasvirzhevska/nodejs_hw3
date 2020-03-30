const express = require('express');
const router = express.Router();
const {
    TruckModel,
    truckValidateSchema,
    truckUpdateSchema,
    assignTruckTo,
    unassignUserTrucksExceptOne,
    findTruckById,
    updateTruck,
    findTruck,
    deleteTruck,
} = require('../models/truckModel');
const errorHandler = require('../api/errorHandler');

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
            errorHandler(errors, res, errors);
            return;
        }

        const dbTruck = new TruckModel(value);

        dbTruck.save((err) => {
            if (err) {
                errorHandler('Error occurred. Try again later', res, err);
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
        findTruck({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    errorHandler('No trucks found.', res);
                    return;
                };

                res.json({ status: 'Ok', trucks });
                res.end();
            })
            .catch((err) => console.error(err));
    }
});

router.put('/truck', (req, res) => {
    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const truck = req.body;
        const { value, error } = truckUpdateSchema.validate(truck);

        findTruckById(truck._id)
            .then((dbTruck) => {
                if (dbTruck.assigned_to) {
                    errorHandler('Truck editing not permitted.', res);
                } else {
                    updateTruck(truck._id, value)
                        .then(() => {
                            res.json({ status: 'Truck profile edited.' });
                            res.end();
                        })
                        .catch((err) => {
                            errorHandler('Error. Try again later.', res, err);
                        });
                }
            })
            .catch((err) => {
                errorHandler('Truck not found.', res);
            });
    }
});

router.patch('/truck', (req, res) => {
    const { _id } = req.body;
    const user = req.user;

    if (!user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        assignTruckTo(_id, user.id)
            .then(() => {
                unassignUserTrucksExceptOne(_id, user.id)
                    .then(() => {
                        res.json({ status: 'Truck assigned.' });
                        res.end();
                    });
            })
            .catch((err) => {
                errorHandler('Error. Try again later.', res, err);
            });
    }
});

router.delete('/truck', (req, res) => {
    const { _id } = req.body;
    const user = req.user;

    if (!user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        findTruckById(_id)
            .then((dbTruck) => {
                if (dbTruck.assigned_to) {
                    errorHandler('Deleting forbiden.', res, err);
                } else {
                    deleteTruck(_id)
                        .then(() => {
                            res.json({ status: 'Truck deleted.' });
                            res.end();
                        });
                }
            })
            .catch((err) => {
                errorHandler('Truck not found.', res, err);
            });
    }
});

module.exports = router;

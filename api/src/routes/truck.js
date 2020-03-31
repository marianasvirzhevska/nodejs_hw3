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
const validateDriver = require('../api/validateDriver');

router.post('/truck', (req, res) => {
    const user = req.user;
    const { valid, permition } = validateDriver(user, res);

    if (valid && permition) {
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
    const { valid } = validateDriver(user, res);

    if (valid) {
        findTruck({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    errorHandler('No trucks found.', res);
                    return;
                };

                res.json({ status: 'Ok', trucks });
                res.end();
            })
            .catch((err) => errorHandler('Server error.', res, err));
    }
});

router.put('/truck', (req, res) => {
    const user = req.user;
    const { valid, permition } = validateDriver(user, res);

    if (valid && permition) {
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
    const { valid, permition } = validateDriver(user, res);

    if (valid && permition) {
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
    const { valid, permition } = validateDriver(user, res);

    if (valid && permition) {
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

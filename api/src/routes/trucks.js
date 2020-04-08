const express = require('express');
const router = express.Router();
const {
    TruckModel,
    truckValidateSchema,
    truckUpdateSchema,
    assignTruckTo,
    unassignUserTrucksExceptOne,
    updateTruck,
    findTruck,
    deleteTruck,
} = require('../models/truckModel');
const {
    updateUser,
} = require('../models/userModel');
const errorHandler = require('../api/errorHandler');
const validateDriver = require('../api/validateDriver');

router.post('/api/trucks', (req, res) => {
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid && user.assigned_load) {
        res.json({ status: 'Driver is on a way. Action not permitted.' });
        res.end();
    } else {
        const { id } = user;
        const { type } = req.body;

        const truck = {
            created_by: id,
            type,
            name: 'Default truck.',
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
                res.json({ status: 'Truck successfully created' });
                res.end();
            }
        });
    }
});

router.get('/api/trucks', (req, res) => {
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findTruck({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    errorHandler('No trucks found.', res, null, 200);
                    return;
                };

                res.json({ status: 'Ok', trucks });
                res.end();
            })
            .catch((err) => errorHandler('Server error.', res, err));
    }
});

router.put('/api/trucks', (req, res) => {
    const user = req.user;
    const truck = req.body;
    const isAssigned = user.assigned_truck === truck._id;
    const isValid = validateDriver(user, res);

    if (!isValid && user.assigned_load && isAssigned) {
        res.json({ status: 'Action not permitted.' });
        res.end();
    } else {
        const { value, error } = truckUpdateSchema.validate(truck);

        updateTruck(truck._id, value)
            .then(() => {
                res.json({ status: 'Truck profile edited.' });
                res.end();
            })
            .catch((err) => {
                errorHandler('Error. Try again later.', res, err);
            });
    }
});

router.patch('/api/trucks/:id/assign', (req, res) => {
    const _id = req.params.id;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (!isValid && user.assigned_load) {
        res.json({ status: 'Action not permitted.' });
        res.end();
    } else {
        const errors = {};

        assignTruckTo(_id, user.id)
            .then(() => {
                Promise.all([
                    unassignUserTrucksExceptOne(_id, user.id)
                        .catch((err) => errors.trucks = err),
                    updateUser(user.id, { assigned_truck: _id })
                        .catch((err) => errors.user = err),
                ])
                    .then(() => {
                        res.json({ status: 'Truck assigned.' });
                        res.end();
                    })
                    .catch(() => res.json(errors));
            })
            .catch((err) => {
                errorHandler('Error. Try again later.', res, err);
            });
    }
});

router.delete('/trucks', (req, res) => {
    const { _id } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (!isValid && user.assigned_load) {
        res.json({ status: 'Action not permitted.' });
        res.end();
    } else {
        if (user.assigned_truck === _id) {
            errorHandler('Deleting forbidden.', res, err);
        } else {
            deleteTruck(_id)
                .then(() => {
                    res.json({ status: 'Truck deleted.' });
                    res.end();
                });
        }
    }
});


module.exports = router;

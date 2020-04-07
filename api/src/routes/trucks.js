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
    findLoadById,
    updateLoad,
} = require('../models/loadModel');
const {
    updateUser,
} = require('../models/userModel');
const errorHandler = require('../api/errorHandler');
const validateDriver = require('../api/validateDriver');
const {
    LOAD_STATE,
    LOAD_STATUS,
    TRUCK_STATUS,
} = require('../constants');

router.post('/trucks', (req, res) => {
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid && user.assigned_load) {
        res.json({ status: 'Driver is on a way. Action not permitted.' });
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

router.get('/trucks', (req, res) => {
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

router.put('/trucks', (req, res) => {
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

router.patch('/trucks', (req, res) => {
    const { _id } = req.body;
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

router.get('/trucks/load-info/:loadId', (req, res) => {
    const loadId = req.params.loadId;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findLoadById(loadId)
            .then((dbLoad) => {
                res.json({ status: 'Ok', dbLoad });
                res.end();
            })
            .catch((err) => errorHandler('Load not found', res, err));
    }
});

router.patch('/trucks/load-info/:loadId', (req, res) => {
    const loadId = req.params.loadId;
    const { state } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);

    const errors = {};

    if (state === LOAD_STATE.ARRIVED_TO_DELIVERY) {
        const log = {
            message: 'Load delivered.',
            time: Date.now(),
        };

        const updateLoadQuery = {
            state,
            status: LOAD_STATUS.SHIPPED,
        };

        const updateDriverQuery = {
            assigned_load: null,
        };

        const updateTruckQuery = {
            status: TRUCK_STATUS.IN_SERVICE,
        };

        Promise.all([
            updateTruck(user.assigned_truck, updateTruckQuery)
                .catch((err) => errors.truck = err),
            updateUser(user.id, updateDriverQuery)
                .catch((err) => errors.user = err),
            updateLoad(loadId, updateLoadQuery, log)
                .catch((err) => errors.load = err),
        ])
            .then(() => {
                res.json({ status: 'Ok', loadStatus: 'Load arrived to delivery.' });
            })
            .catch(() => res.json(errors));
    } else {
        const updateLoadQuery = { state };
        const log = {
            message: `Load state updated to: ${state}`,
            time: Date.now(),
        };

        if (isValid) {
            updateLoad(loadId, updateLoadQuery, log)
                .then(() => {
                    res.json({ status: `Load state updated to: ${state}` });
                    res.end();
                })
                .catch((err) => errorHandler('Load not found', res, err));
        }
    }
});

module.exports = router;

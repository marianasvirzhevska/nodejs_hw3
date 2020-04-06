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
const {
    findLoadById,
    updateLoad,
} = require('../models/loadModel');
const {
    findUserById,
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

    if (isValid) {
        findUserById(user.id)
            .then((dbDriver) => {
                const { assigned_load: assignedLoad } = dbDriver;

                if (assignedLoad) {
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
            })
            .catch((err) => errorHandler('Server error', res, err));
    }
});

router.get('/trucks', (req, res) => {
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findTruck({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    errorHandler('No trucks found.', res, null, 404);
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
    const isValid = validateDriver(user, res);

    if (isValid) {
        findUserById(user.id)
            .then((dbDriver) => {
                const { assigned_load: assignedLoad } = dbDriver;

                if (assignedLoad) {
                    res.json({ status: 'Driver is on a way. Action not permitted.' });
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
            })
            .catch((err) => errorHandler('Server error.', res, err));
    }
});

router.patch('/trucks', (req, res) => {
    const { _id } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findUserById(user.id)
            .then((dbDriver) => {
                const { assigned_load: assignedLoad } = dbDriver;

                if (assignedLoad) {
                    res.json({ status: 'Driver is on a way. Action not permitted.' });
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
            })
            .catch((err) => errorHandler('Server error.', res, err));
    }
});

router.delete('/trucks', (req, res) => {
    const { _id } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findUserById(user.id)
            .then((dbDriver) => {
                const { assigned_load: assignedLoad } = dbDriver;

                if (assignedLoad) {
                    res.json({ status: 'Driver is on a way. Action not permitted.' });
                    res.end();
                } else {
                    findTruckById(_id)
                        .then((dbTruck) => {
                            if (dbTruck.assigned_to) {
                                errorHandler('Deleting forbidden.', res, err);
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
            })
            .catch((err) => errorHandler('Server error.', res, err));
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

        updateLoad(loadId, updateLoadQuery, log)
            .then(() => {
                res.json({ status: 'Ok', loadStatus: 'Load arrived to delivery.' });
            })
            .catch((err) => errors.load = err);

        updateTruck(user.assigned_to, updateTruckQuery)
            .then(() => {
                res.json({ truckStatus: 'Truck is In Service.' });
            })
            .catch((err) => errors.truck = err);

        updateUser(user._id, updateDriverQuery)
            .then(() => {
                console.log('user._id', user._id, updateDriverQuery);
                res.json({ driverStatus: 'Load delivered.' });
            })
            .catch((err) => {
                errors.user = err;
                errorHandler('Can not update driver profile.', res, errors);
            });
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

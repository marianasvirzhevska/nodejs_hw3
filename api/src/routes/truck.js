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

router.post('/truck', (req, res) => {
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

router.get('/truck', (req, res) => {
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
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

router.patch('/truck', (req, res) => {
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

router.delete('/truck', (req, res) => {
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
            })
            .catch((err) => errorHandler('Server error.', res, err));
    }
});

router.get('/truck/load-info', (req, res) => {
    const { _id, assigned_to: assignedLoadId } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);

    if (isValid) {
        findLoadById(assignedLoadId)
            .then((dbLoad) => {
                const loadInfo = { ...dbLoad };
                delete loadInfo.logs;

                res.json({ status: 'Ok', loadInfo });
                res.end();
            })
            .catch((err) => errorHandler('Load not found', res, err));
    }
});

router.patch('/truck/load-info', (req, res) => {
    const { loadState, truckId } = req.body;
    const user = req.user;
    const isValid = validateDriver(user, res);
    const updateLoadQuery = {
        state: loadState,
    };

    if (loadState === LOAD_STATE.ARRIVED_TO_DELIVERY) {
        const log = {
            message: 'Load delivered.',
            time: Date.now(),
        };

        const updateDriverQuery = {
            assigned_load: null,
        };

        updateLoad(user.assigned_load, updateLoadQuery, log)
            .then(() => {
                res.json({ status: 'Ok', loadStatus: 'Load arrived to delyvery.' });
            })
            .catch((err) => errorHandler('Can not update load.', res, err));

        updateTruck(truckId, updateTruckQuery)
            .then(() => {
                res.json({ truckStatus: 'Truck is In Service.' });
            })
            .catch((err) => errorHandler('Can not update truck.', res, err));

        updateUser(user._id, updateDriverQuery)
            .then(() => {
                res.json({ driverStatus: 'Load delivered.' });
            })
            .catch((err) => errorHandler('Can not update driver profile.', res, err));
    } else {
        const log = {
            message: `Load state updated to: ${loadState}`,
            time: Date.now(),
        };

        if (isValid) {
            updateLoad(user.assigned_load, updateLoadQuery, log)
                .then(() => {
                    res.json({ status: 'Load state updated.' });
                    res.end();
                })
                .catch((err) => errorHandler('Load not found', res, err));
        }
    }
});

module.exports = router;

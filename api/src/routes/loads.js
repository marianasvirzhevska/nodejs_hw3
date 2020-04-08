const express = require('express');
const router = express.Router();
const {
    LoadModel,
    loadValidateSchema,
    loadUpdateSchema,
    findLoad,
    findLoadById,
    updateLoad,
    deleteLoad,
} = require('../models/loadModel');
const {
    updateTruck,
} = require('../models/truckModel');
const {
    updateUser,
} = require('../models/userModel');
const { LOAD_STATUS, LOAD_STATE, USER_ROLE, TRUCK_STATUS } = require('../constants');
const errorHandler = require('../api/errorHandler');
const findTruck = require('../api/findTruck');
const validateShipper = require('../api/validateShipper');
const validateDriver = require('../api/validateDriver');

router.post('/api/loads', (req, res) => {
    const user = req.user;
    const isValid = validateShipper(user, res);

    if (isValid) {
        const { id } = user;
        const { dimensions, payload } = req.body;

        const load = {
            created_by: id,
            dimensions,
            payload,
        };

        const { value, error } = loadValidateSchema.validate(load);

        if (error) {
            const errors = error.details;
            res.json(errors);
            res.end();
            return;
        }

        const dbLoad = new LoadModel(value);

        dbLoad.save((err) => {
            if (err) {
                errorHandler('Error occurred. Try again later', res, err);
            } else {
                res.json({ status: 'OK', message: 'Load successfully created.' });
                res.end();
            }
        });
    }
});

router.get('/api/loads', (req, res) => {
    const user = req.user;

    switch (user.role) {
    case USER_ROLE.SHIPPER:
        findLoad({ created_by: user.id })
            .then((loads) => {
                if (!loads.length) {
                    errorHandler('No loads found.', res);
                    return;
                };

                res.json({ status: 'OK', loads });
                res.end();
            })
            .catch((err) => errorHandler(err, res));
        break;
    case USER_ROLE.DRIVER:
        findLoadById(user.assigned_load)
            .then((loads) => {
                res.json({ status: 'Ok', loads });
                res.end();
            })
            .catch((err) => errorHandler('Load not found', res, err));
        break;
    default:
        errorHandler('Access denied', res);
    }
});

router.put('/api/loads', (req, res) => {
    const isValid = validateShipper(req.user, res);

    if (isValid) {
        const load = req.body;
        const { value, error } = loadUpdateSchema.validate(load);
        const log = {
            message: 'Load edited.',
            time: Date.now(),
        };

        if (error) {
            const errors = error.details;
            errorHandler(errors, res);
            return;
        }

        findLoadById(load._id)
            .then((dbLoad) => {
                if (dbLoad.status !== LOAD_STATUS.NEW) {
                    errorHandler('Load editing not permitted.', res);
                } else {
                    updateLoad(load._id, value, log)
                        .then(() => {
                            res.json({ status: 'OK', message: 'Load edited.' });
                            res.end();
                        })
                        .catch((err) => {
                            errorHandler('Error. Try again later.', res, err);
                        });
                }
            })
            .catch((err) => errorHandler('Load not found.', res, err));
    }
});

router.delete('/loads', (req, res) => {
    const { _id } = req.body;
    const user = req.user;
    const isValid = validateShipper(user, res);

    if (isValid) {
        findLoadById(_id)
            .then((dbLoad) => {
                if (dbLoad.status === LOAD_STATUS.NEW || dbLoad.status === LOAD_STATUS.SHIPPED) {
                    deleteLoad(_id)
                        .then(() => {
                            res.json({ status: 'OK', message: 'Load deleted.' });
                            res.end();
                        })
                        .catch((err) => errorHandler(err, res));
                } else {
                    errorHandler('Deleting forbidden.', res, null, 403);
                }
            })
            .catch((err) => errorHandler('Load not found.', res, err));
    }
});

router.patch('/api/loads/:id/post', (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const isValid = validateShipper(user, res);

    const doc = {
        status: LOAD_STATUS.POSTED,
        state: LOAD_STATE.PENDING,
    };

    const log = {
        message: 'Load posted.',
        time: Date.now(),
    };

    if (isValid) {
        updateLoad(id, doc, log)
            .then(() => {
                findTruck(id, res);
            })
            .catch((err) => {
                errorHandler('Error. Try again later.', res, err);
            });
    }
});

router.patch('/api/loads/:id/state', (req, res) => {
    const loadId = req.params.id;
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

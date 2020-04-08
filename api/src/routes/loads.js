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
const { LOAD_STATUS, LOAD_STATE } = require('../constants');
const errorHandler = require('../api/errorHandler');
const findTruck = require('../api/findTruck');
const validateShipper = require('../api/validateShipper');

router.post('/loads', (req, res) => {
    const user = req.user;
    const isValid = validateShipper(user, res);

    if (isValid) {
        const { id } = user;
        const { name, dimensions, payload } = req.body;

        const load = {
            name,
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
                res.json({ status: 'OK', message: 'Load successfully created', dbLoad });
                res.end();
            }
        });
    }
});

router.get('/loads', (req, res) => {
    const user = req.user;
    const isValid = validateShipper(user, res);

    if (isValid) {
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
    }
});

router.put('/loads', (req, res) => {
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

router.patch('/loads', (req, res) => {
    const { _id } = req.body;
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
        updateLoad(_id, doc, log)
            .then(() => {
                findTruck(_id, res);
            })
            .catch((err) => {
                errorHandler('Error. Try again later.', res, err);
            });
    }
});

module.exports = router;

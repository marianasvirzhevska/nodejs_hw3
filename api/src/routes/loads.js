const express = require('express');
const router = express.Router();
const {
    LoadModel,
    loadValidateSchema,
} = require('../models/loadModel');
const objectID = require('mongodb').ObjectID;
const { LOAD_STATUS } = require('../constants');

router.post('/loads', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
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
                res.status(500).json({ status: 'Error occurred. Try again later' });
                res.end();
                throw err;
            } else {
                res.json({ status: 'Load successfully created', dbLoad });
                res.end();
            }
        });
    }
});

router.get('/loads', (req, res) => {
    const user = req.user;

    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        LoadModel.find({ created_by: user.id })
            .then((loads) => {
                if (!loads.length) {
                    res.json({ status: 'No loads found.' });
                    res.end();
                    return;
                };

                res.json({ status: 'Ok', loads });
                res.end();
            })
            .catch((err) => console.error(err));
    }
});

router.put('/loads', (req, res) => {
    if (!req.user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        const load = req.body;
        const { value, error } = loadValidateSchema.validate(load);

        if (error) {
            const errors = error.details;
            res.json(errors);
            res.end();
            return;
        }

        const loadValidated = new LoadModel(value);

        LoadModel.findById(load._id, (err, dbLoad) => {
            if (err) {
                console.error(err);

                res.status(500).json({ status: 'Load not found.' });
                res.end();
                return;
            }

            if (dbLoad.status !== LOAD_STATUS.NEW) {
                res.status(500).json({ status: 'Load editing not permitted.' });
                res.end();
            } else {
                LoadModel.updateOne({ _id: objectID(load._id) }, { $set: loadValidated })
                    .then((raw) => {
                        res.json({ status: 'Load edited.' });
                        res.end();
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ status: 'Error. Try again later.' });
                        res.end();
                    });
            }
        });
    }
});

module.exports = router;

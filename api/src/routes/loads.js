const express = require('express');
const router = express.Router();
const {
    LoadModel,
    loadValidateSchema,
} = require('../models/loadModel');
const objectID = require('mongodb').ObjectID;

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

module.exports = router;

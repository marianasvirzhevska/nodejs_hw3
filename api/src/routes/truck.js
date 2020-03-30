const express = require('express');
const router = express.Router();
const {
    TruckModel,
} = require('../models/truckModel');
const objectID = require('mongodb').ObjectID;

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
            res.json(errors);
            res.end();
            return;
        }

        const dbTruck = new TruckModel(value);

        dbTruck.save((err) => {
            if (err) {
                res.status(500).json({ status: 'Error occurred. Try again later' });
                res.end();
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
        TruckModel.find({ created_by: user.id })
            .then((trucks) => {
                if (!trucks.length) {
                    res.json({ status: 'No trucks found.' });
                    res.end();
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

        TruckModel.findById(truck._id, (err, dbTruck) => {
            if (err) {
                console.error(err);

                res.status(500).json({ status: 'Truck not found.' });
                res.end();
                return;
            }

            if (dbTruck.assigned_to) {
                res.status(500).json({ status: 'Truck editing not permitted.' });
                res.end();
            } else {
                TruckModel.updateOne({ _id: objectID(truck._id) }, { $set: truck })
                    .then((raw) => {
                        res.json({ status: 'Truck profile edited.' });
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

router.put('/assign', (req, res) => {
    const { _id } = req.body;
    const user = req.user;

    if (!user) {
        res.status(401).json({ status: 'Invalid user token.' });
        res.end();
    } else {
        TruckModel.updateOne({ _id: objectID(_id) }, { $set: { assigned_to: user.id } })
            .then((raw) => {
                TruckModel.updateMany(
                    {
                        _id: { $ne: objectID(_id) },
                    },
                    { assigned_to: null },
                )
                    .then((r) => {
                        res.json({ status: 'Truck assigned.' });
                        res.end();
                    });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ status: 'Error. Try again later.' });
                res.end();
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
        TruckModel.findById(_id, (err, dbTruck) => {
            if (err) {
                console.error(err);

                res.status(500).json({ status: 'Truck not found.' });
                res.end();
                return;
            }

            if (dbTruck.assigned_to) {
                res.status(500).json({ status: 'Deleting forbiden.' });
                res.end();
            } else {
                TruckModel.deleteOne({ _id: objectID(_id) })
                    .then(() => {
                        res.json({ status: 'Truck deleted.' });
                        res.end();
                    });
            }
        });
    }
});

module.exports = router;

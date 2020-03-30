const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { TRUCK_STATUS } = require('../constants');
const objectID = require('mongodb').ObjectID;

const truckSchema = mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    status: {
        type: String,
        default: TRUCK_STATUS.IN_SERVICE,
    },
    type: String,
    name: String,
});

const TruckModel = mongoose.model('Truck', truckSchema);

const truckValidateSchema = Joi.object({
    _id: Joi.string(),
    created_by: Joi.string().required(),
    assigned_to: Joi.string(),
    status: Joi.string(),
    type: Joi.string().required(),
    name: Joi.string().required(),
});

function assignTruckTo(truckId, userId) {
    return TruckModel.updateOne(
        { _id: objectID(truckId) },
        { $set: { assigned_to: userId } },
    );
}

function unassignUserTrucksExceptOne(skipTruckId, userId) {
    return TruckModel.updateMany(
        {
            _id: { $ne: objectID(skipTruckId) },
            assigned_to: objectID(userId),
        },
        { assigned_to: null },
    );
}


// TruckModel.findById(truck._id, (err, dbTruck) => {
//     if (err) {
//         console.error(err);

//         res.status(500).json({ status: 'Truck not found.' });
//         res.end();
//         return;
//     }

//     if (dbTruck.assigned_to) {
//         res.status(500).json({ status: 'Truck editing not permitted.' });
//         res.end();
//     } else {
//         TruckModel.updateOne({ _id: objectID(truck._id) }, { $set: truck })
//             .then((raw) => {
//                 res.json({ status: 'Truck profile edited.' });
//                 res.end();
//             })
//             .catch((err) => {
//                 console.error(err);
//                 res.status(500).json({ status: 'Error. Try again later.' });
//                 res.end();
//             });
//     }
// });

function findTruckById(truckId) {
    return TruckModel.findById(truckId);
};

function updateTruck(truckId, doc) {
    return TruckModel.updateOne({ _id: objectID(truckId) }, { $set: doc });
};

module.exports = {
    TruckModel,
    truckValidateSchema,
    assignTruckTo,
    unassignUserTrucksExceptOne,
    findTruckById,
    updateTruck,
};

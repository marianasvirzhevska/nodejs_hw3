const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { TRUCK_STATUS } = require('../constants');
const ObjectID = require('mongodb').ObjectID;

const truckSchema = new mongoose.Schema({
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

const truckUpdateSchema = Joi.object({
    type: Joi.string().required(),
    name: Joi.string().required(),
});

function assignTruckTo(truckId, userId) {
    return TruckModel.updateOne(
        { _id: new ObjectID(truckId) },
        { $set: { assigned_to: userId } },
    );
}

function unassignUserTrucksExceptOne(skipTruckId, userId) {
    return TruckModel.updateMany(
        {
            _id: { $ne: new ObjectID(skipTruckId) },
            assigned_to: new ObjectID(userId),
        },
        { assigned_to: null },
    );
}

function findTruckById(truckId) {
    return TruckModel.findById(truckId);
};

function findTruck(query) {
    return TruckModel.find(query);
}

function updateTruck(truckId, doc) {
    return TruckModel.updateOne({ _id: new ObjectID(truckId) }, { $set: doc });
};

function deleteTruck(truckId) {
    return TruckModel.deleteOne({ _id: new ObjectID(truckId) });
}

module.exports = {
    TruckModel,
    truckValidateSchema,
    truckUpdateSchema,
    assignTruckTo,
    unassignUserTrucksExceptOne,
    findTruckById,
    updateTruck,
    findTruck,
    deleteTruck,
};

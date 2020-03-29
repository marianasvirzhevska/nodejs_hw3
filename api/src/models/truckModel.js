const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { TRUCK_STATUS } = require('../constants');

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

module.exports = {
    TruckModel,
    truckValidateSchema,
};

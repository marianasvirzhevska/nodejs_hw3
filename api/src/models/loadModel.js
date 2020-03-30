const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { LOAD_STATUS } = require('../constants');

const loadSchema = mongoose.Schema({
    name: String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    logs: [
        {
            message: String,
            time: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    status: {
        type: String,
        default: LOAD_STATUS.NEW,
    },
    state: {
        type: String,
        default: null,
    },
    dimensions: {
        width: Number,
        length: Number,
        height: Number,
    },
    payload: Number,
});

const LoadModel = mongoose.model('Load', loadSchema);

const logSchema = Joi.object({
    message: Joi.string(),
    time: Joi.date().iso(),
});

const dimensionsSchema = Joi.object({
    width: Joi.number().required(),
    length: Joi.number().required(),
    height: Joi.number().required(),
});

const loadValidateSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string(),
    created_by: Joi.string(),
    logs: Joi.array().items(logSchema),
    assigned_to: Joi.string(),
    status: Joi.string(),
    state: Joi.string(),
    dimensions: dimensionsSchema,
    payload: Joi.number(),
});

module.exports = {
    LoadModel,
    loadValidateSchema,
};

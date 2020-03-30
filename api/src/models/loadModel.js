const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const objectID = require('mongodb').ObjectID;
const { LOAD_STATUS } = require('../constants');

const logsSchema = mongoose.Schema({
    message: {
        type: String,
        default: 'Load created.',
    },
    time: {
        type: Date,
        default: Date.now(),
    },
});

const loadSchema = mongoose.Schema({
    name: String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    logs: {
        type: [ logsSchema ],
        default: [
            {
                message: 'Load created.',
                time: Date.now(),
            },
        ],
    },
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
    time: Joi.date(),
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

const loadUpdateSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    dimensions: dimensionsSchema,
    payload: Joi.number().required(),
});

function findLoad(query) {
    return LoadModel.find(query);
}

function findLoadById(loadId) {
    return LoadModel.findById(loadId);
}

function updateLoad(loadId, doc, log) {
    return LoadModel.updateOne(
        {
            _id: objectID(loadId),
        },
        { $set: doc, $push: { logs: log } });
}

function deleteLoad(loadId) {
    return LoadModel.deleteOne({ _id: objectID(loadId) });
}

module.exports = {
    LoadModel,
    loadValidateSchema,
    loadUpdateSchema,
    findLoad,
    findLoadById,
    updateLoad,
    deleteLoad,
};

const truckMap = require('../api/getTruck');
const {
    findLoadById,
    updateLoad,
} = require('../models/loadModel');
const {
    updateUser,
} = require('../models/userModel');
const {
    findTruck: findTruckByQuery,
    updateTruck,
} = require('../models/truckModel');
const errorHandler = require('../api/errorHandler');
const {
    LOAD_STATE,
    LOAD_STATUS,
    TRUCK_STATUS,
} = require('../constants');


function findTruck(loadId, res) {
    findLoadById(loadId)
        .then((dbLoad) => {
            findTruckByQuery(
                {
                    assigned_to: { $ne: null },
                    status: TRUCK_STATUS.IN_SERVICE,
                })
                .then((trucks) => {
                    if (trucks.length) {
                        const validTrucks = trucks.filter((truck) => isTruckMatch(dbLoad, truck.type));
                        const smalestValidTruck = getSmallestPayloadTrucks(validTrucks);

                        const log = {
                            message: 'Load assigned to driver.',
                            time: Date.now(),
                        };

                        const updateLoadQuery = {
                            assigned_to: smalestValidTruck[0].assigned_to,
                            state: LOAD_STATE.ON_ROUTE_TO_PICK_UP,
                            status: LOAD_STATUS.ASSIGNED,
                        };

                        const updateDriverQuery = {
                            assigned_load: dbLoad._id,
                        };

                        console.log(updateDriverQuery);

                        const updateTruckQuery = {
                            status: TRUCK_STATUS.ON_LOAD,
                        };

                        updateLoad(dbLoad._id, updateLoadQuery, log)
                            .then(() => {
                                res.json({ status: 'Load assigned.', updateLoadQuery });
                                res.end();
                            })
                            .catch((err) => errorHandler('Can\'t assign driver', res, err));

                        updateUser(smalestValidTruck[0].assigned_to, updateDriverQuery)
                            .then(() => {
                                console.log('Load successfully assigned to user.');
                            })
                            .catch((err) => errorHandler('Server error.', res, err));

                        updateTruck(smalestValidTruck[0]._id, updateTruckQuery)
                            .then(() => {
                                console.log('Truck successfully updated.');
                            })
                            .catch((err) => errorHandler('Server error.', res, err));
                    } else {
                        const updateLoadQuery = {
                            status: LOAD_STATUS.NEW,
                        };

                        updateLoad(dbLoad._id, updateLoadQuery)
                            .then(() => {
                                res.json({ status: 'Truck not found. Try again latter.', updateLoadQuery });
                                res.end();
                            })
                            .catch((err) => errorHandler('Server error.', res, err));
                    }
                });
        });
}

function isTruckMatch(load, truckType) {
    const truck = truckMap[truckType];

    const areDimsValid = areDimensionsValid(load, truck);
    const isPayloadValid = truck.payload > load.payload;

    return isPayloadValid && areDimsValid;
};

function areDimensionsValid(load, truck) {
    const truckDims = sortedObjValues(truck.dimensions);
    const desiredDims = sortedObjValues(load.dimensions);

    return !truckDims.some((dim, i) => {
        return dim < desiredDims[i];
    });
};

function sortedObjValues(obj) {
    return Object.values(obj)
        .sort((a, b) => a - b);
};

function getSmallestPayloadTrucks(trucks) {
    return trucks.reduce(
        (acc, next) => {
            if (!acc[0] || next.payload < acc[0]) {
                return [ next ];
            }

            if (next.payload === acc[0].payload) {
                return acc.concat(next);
            }

            return acc;
        },
        [],
    );
}

module.exports = findTruck;

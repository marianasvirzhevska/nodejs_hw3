const truckMap = require('../api/getTruck');
const {
    findLoadById,
    updateLoad,
} = require('../models/loadModel');
const {
    findTruck: findTruckByQuery,
} = require('../models/truckModel');
const errorHandler = require('../api/errorHandler');

function findTruck(loadId, res) {
    findLoadById(loadId)
        .then((dbLoad) => {
            findTruckByQuery({ assigned_to: { $ne: null } })
                .then((trucks) => {
                    if (trucks.length) {
                        const validTrucks = trucks.filter((truck) => isTruckMatch(dbLoad, truck.type));
                        const smalestValidTruck = getSmallestPayloadTrucks(validTrucks);

                        const assignLoadQuery = {
                            assigned_to: smalestValidTruck[0].assigned_to,
                        };

                        const assignDriverQuery = {
                            assigned_load: dbLoad._id,
                        };

                        updateLoad(dbLoad._id, assignLoadQuery)
                            .then(() => {
                                res.json({ status: 'Load assigned.', assignLoadQuery });
                                res.end();
                            })
                            .catch((err) => errorHandler('Can\'t assign driver', res, err));
                    } else {
                        console.log('no trucks');
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

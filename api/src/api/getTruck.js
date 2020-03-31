const { TRUCK_TYPE } = require('../constants');

const truckMap = {
    // [TRUCK_TYPE]: truck(width, height, length, payload)
    [TRUCK_TYPE.SPRINTER]: truck(170, 250, 300, 1700),
    [TRUCK_TYPE.SMALL_STRAIGHT]: truck(170, 250, 500, 2500),
    [TRUCK_TYPE.LARGE_STRAIGHT]: truck(170, 250, 700, 4000),
};

function truck(width, height, length, payload) {
    return {
        dimensions: {
            width,
            height,
            length,
        },
        payload,
    };
}

module.exports = truckMap;

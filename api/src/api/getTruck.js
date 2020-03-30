const { TRUCK_TYPE } = require('../constants');

const truckMap = {
    // [TRUCK_TYPE]: truck(width, height, length, payload)
    [TRUCK_TYPE.SPRINTER]: truck(300, 170, 250, 1700),
    [TRUCK_TYPE.SMALL_STRAIGHT]: truck(500, 170, 250, 2500),
    [TRUCK_TYPE.LARGE_STRAIGHT]: truck(700, 170, 250, 4000),
};

function truck(width, height, length, payload) {
    return {
        dimensions: {
            width,
            length,
            height,
        },
        payload,
    };
}

module.exports = {
    truckMap,
};

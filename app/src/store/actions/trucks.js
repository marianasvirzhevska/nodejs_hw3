import {
    GET_SERVER_TRUCKS,
    CREATE_TRUCK,
    EDIT_TRUCK,
    DELETE_TRUCK,
    ASSIGN_TRUCK,
} from '../constants';

export function getServerTrucks(trucks) {
    return {
        type: GET_SERVER_TRUCKS,
        payload: trucks,
    };
};

export const createTruck = (truck) => {
    return {
        type: CREATE_TRUCK,
        payload: truck,
    };
};

export const editTruck = (truck) => {
    return {
        type: EDIT_TRUCK,
        payload: truck,
    };
};

export const deleteTruck = (truck) => {
    return {
        type: DELETE_TRUCK,
        payload: truck,
    };
};

export const assignTruck = (truck) => {
    return {
        type: ASSIGN_TRUCK,
        payload: truck,
    };
};


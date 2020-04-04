import {
    GET_SERVER_LOADS,
    CREATE_LOAD,
    EDIT_LOAD,
    DELETE_LOAD,
} from '../constants';

export function getServerLoads(loads) {
    return {
        type: GET_SERVER_LOADS,
        payload: loads,
    };
};

export const createLoad = (load) => {
    return {
        type: CREATE_LOAD,
        payload: load,
    };
};

export const editLoad = (load) => {
    return {
        type: EDIT_LOAD,
        payload: load,
    };
};

export const deleteLoad = (load) => {
    return {
        type: DELETE_LOAD,
        payload: load,
    };
};


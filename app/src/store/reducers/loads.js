import {
    GET_SERVER_LOADS,
    CREATE_LOAD,
    EDIT_LOAD,
    DELETE_LOAD,
} from '../constants';


const LoadsState = {
    loads: [],
    loaded: false,
    error: null,
};

const loadsReducer = ( state = LoadsState, action) => {
    switch (action.type) {
    case GET_SERVER_LOADS:
        return {
            ...state,
            loads: action.payload,
            error: null,
        };
    case CREATE_LOAD:
        return {
            ...state,
            loads: [...state.loads, action.payload],
            error: null,
        };
    case EDIT_LOAD:
        const load = action.payload;
        const editedLoads = state.loads.map((item) => {
            if (item._id !== load._id) {
                return item;
            }

            return {
                ...item,
                ...load,
            };
        });
        return {
            ...state,
            loads: editedLoads,
            errors: null,
        };

    case DELETE_LOAD:
        const _load = action.payload;
        const loadIndex = state.loads.findIndex((item) => item._id === _load._id);

        const newLoads = [...state.loads];
        newLoads.splice(loadIndex, 1);

        return {
            ...state,
            loads: newLoads,
            error: null,
        };

    default:
        return state;
    }
};

export default loadsReducer;

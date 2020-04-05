import {
    GET_SERVER_TRUCKS,
    CREATE_TRUCK,
    EDIT_TRUCK,
    DELETE_TRUCK,
    ASSIGN_TRUCK,
} from '../constants';


const TrucksState = {
    trucks: [],
    loaded: false,
    error: null,
};

const trucksReducer = ( state = TrucksState, action) => {
    switch (action.type) {
    case GET_SERVER_TRUCKS:
        return {
            ...state,
            trucks: action.payload,
            error: null,
        };
    case CREATE_TRUCK:
        return {
            ...state,
            trucks: [...state.trucks, action.payload],
            error: null,
        };
    case EDIT_TRUCK:
        const truck = action.payload;
        const editedTrucks = state.trucks.map((item) => {
            if (item._id !== truck._id) {
                return item;
            }

            return {
                ...item,
                ...truck,
            };
        });
        return {
            ...state,
            trucks: editedTrucks,
            errors: null,
        };

    case DELETE_TRUCK:
        const _truck = action.payload;
        const truckIndex = state.trucks.findIndex((item) => item._id === _truck._id);

        const newTrucks = [...state.trucks];
        newTrucks.splice(truckIndex, 1);

        return {
            ...state,
            trucks: newTrucks,
            error: null,
        };

    case ASSIGN_TRUCK:
        const assigned = action.payload;
        const assignedTrucks = state.trucks.map((item) => {
            if (item._id !== assigned._id) {
                item.assigned_to = null;
            } else {
                item.assigned_to = assigned._id;
            }

            return item;
        });

        return {
            ...state,
            trucks: assignedTrucks,
            error: null,
        };

    default:
        return state;
    }
};

export default trucksReducer;

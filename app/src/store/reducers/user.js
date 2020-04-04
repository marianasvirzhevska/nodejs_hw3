
import {
    EDIT_USER,
    DELETE_USER,
} from '../constants';


const UsersState = {
    users: [],
    loaded: false,
    error: null,
};

const usersReducer = ( state = UsersState, action) => {
    switch (action.type) {
    case EDIT_USER:
        const user = action.payload;

        return {
            ...state,
            user: { ...state.user, ...user },
            errors: null,
        };

    default:
        return state;
    }
};

export default usersReducer;

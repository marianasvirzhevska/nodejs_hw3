
import {
    EDIT_USER,
    DELETE_USER,
    GET_USER_INFO,
} from '../constants';


const UserState = {
    userInfo: {},
    loaded: false,
    error: null,
};

const userReducer = ( state = UserState, action) => {
    switch (action.type) {
    case EDIT_USER:
        const editUser = action.payload;

        return {
            ...state,
            userInfo: { ...state.userInfo, ...editUser },
            errors: null,
        };
    case GET_USER_INFO:
        const userInfo = action.payload;

        return {
            ...state,
            userInfo: userInfo,
            errors: null,
        };

    default:
        return state;
    }
};

export default userReducer;

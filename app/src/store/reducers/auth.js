import {
    LOGIN_USER,
    LOGOUT,
} from '../constants';


const AuthState = {
    auth: false,
    error: null,
};

const authReducer = ( state = AuthState, action) => {
    switch (action.type) {
    case LOGIN_USER:
        return {
            ...state,
            auth: true,
            error: null,
        };
    case LOGOUT:
        return {
            ...state,
            auth: false,
            error: null,
        };

    default:
        return state;
    }
};

export default authReducer;

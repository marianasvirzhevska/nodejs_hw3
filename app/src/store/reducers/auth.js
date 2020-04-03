import {
    REGISTER_USER,
    LOGIN_USER,
    LOGOUT,
} from '../constants';


const AuthState = {
    user: {},
    auth: false,
    error: null,
};

const authReducer = ( state = AuthState, action) => {
    switch (action.type) {
    case REGISTER_USER:
        return {
            ...state,
            auth: true,
            user: action.payload,
            error: null,
        };

    case LOGIN_USER:
        return {
            ...state,
            auth: true,
            user: action.payload,
            error: null,
        };
    case LOGOUT:
        return {
            ...state,
            auth: false,
            user: {},
            error: null,
        };

    default:
        return state;
    }
};

export default authReducer;

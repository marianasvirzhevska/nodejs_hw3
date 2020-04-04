import {
    LOGIN_USER,
    LOGOUT,
} from '../constants';

export function login() {
    return {
        type: LOGIN_USER,
    };
}

export const logout = () => {
    return {
        type: LOGOUT,
    };
};


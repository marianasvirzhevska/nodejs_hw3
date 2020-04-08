import {
    EDIT_USER,
    GET_USER_INFO,
} from '../constants';

export const editUser = (userInfo) => {
    return {
        type: EDIT_USER,
        payload: userInfo,
    };
};


export const getUserInfo = (userInfo) => {
    return {
        type: GET_USER_INFO,
        payload: userInfo,
    };
};

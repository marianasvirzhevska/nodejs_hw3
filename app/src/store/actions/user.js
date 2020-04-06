import {
    EDIT_USER,
} from '../constants';

export const editUser = (user) => {
    return {
        type: EDIT_USER,
        payload: user,
    };
};

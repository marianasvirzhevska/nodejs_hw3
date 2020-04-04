import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth';
import user from './user';

const reducer = combineReducers({
    form: formReducer,
    auth: auth,
    user: user,
});

export default reducer;

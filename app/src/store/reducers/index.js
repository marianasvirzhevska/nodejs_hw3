import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth';
import user from './user';
import loads from './loads';

const reducer = combineReducers({
    form: formReducer,
    auth: auth,
    user: user,
    loads: loads,
});

export default reducer;

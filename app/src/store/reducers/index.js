import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth';
import user from './user';
import loads from './loads';
import trucks from './trucks';

const reducer = combineReducers({
    form: formReducer,
    auth,
    user,
    loads,
    trucks,
});

export default reducer;

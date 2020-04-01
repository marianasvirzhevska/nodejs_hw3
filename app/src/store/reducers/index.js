import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth';

const reducer = combineReducers({
    form: formReducer,
    auth: auth,
});

export default reducer;

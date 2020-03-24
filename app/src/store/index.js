import {createStore, compose} from 'redux';
import reducer from './reducers';

const composeEnhancers = process.env.NODE_ENV !== 'production'
    && typeof window !== 'undefined'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore( reducer, composeEnhancers() );

export default store;

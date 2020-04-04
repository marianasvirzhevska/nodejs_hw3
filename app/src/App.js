import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';

import theme from './muiTheme';
import store from './store/index';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Loads from './components/Loads';
import NotFound from './components/NotFound';

function App() {
    return (
        <Router>
            <Switch>
                <PublicRoute restricted={true} component={Login} path="/" exact />
                <PublicRoute restricted={true} component={Register} path="/register" exact />
                <PrivateRoute component={Profile} path="/profile" exact />
                <PrivateRoute component={Loads} path="/loads" exact />
                <Route path="*" component={NotFound}/>
            </Switch>
        </Router>
    );
}

const AppProvider = () => (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <App />
        </Provider>
    </ThemeProvider>
);

export default AppProvider;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { Provider } from 'react-redux';

import theme from './muiTheme';
import store from './store/index';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';

function App() {
    return (
        <Router>
            <Switch>
                <PublicRoute restricted={true} component={Login} path="/" exact />
                <PublicRoute restricted={true} component={Register} path="/register" exact />
                <PrivateRoute component={Dashboard} path="/dashboard" exact />
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

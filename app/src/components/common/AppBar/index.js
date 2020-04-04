import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styles from './AppBar.module.sass';
import { LOGOUT } from '../../../store/constants';

const AppBar = ( props ) => {
    const { title } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        dispatch({ type: LOGOUT });
        localStorage.removeItem('user');
        history.push('/');
    };

    return (
        <div className={styles.appBar}>
            <div className="container">
                <div className="container-fluid">
                    <div className={styles.appContainer}>
                        <h1 className={styles.title}>
                            {title}
                        </h1>
                        <div className={styles.logoutBtn}>
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={logout}
                            >Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AppBar.propTypes = {
    title: PropTypes.string,
};


export default AppBar;

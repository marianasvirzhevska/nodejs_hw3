import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import styles from './NotFound.module.sass';

const NotFound = () => {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Link to='/'><img src={logo} alt="logo"/></Link>
            </div>
            <div className={styles.container}>
                <h1>Page Not Found</h1>
            </div>
            <div className={styles.footer}>
                <div>
                    <p>Copyright © 2020 Manage Software Tools</p>
                    <p>Terms and conditions</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

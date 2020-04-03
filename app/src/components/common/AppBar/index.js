import React from 'react';
import PropTypes from 'prop-types';
import styles from './AppBar.module.sass';

const AppBar = ( props ) => {
    const { title } = props;

    return (
        <div className={styles.appBar}>
            <h1 className={styles.title}>
                {title}
            </h1>
        </div>
    );
};

AppBar.propTypes = {
    title: PropTypes.string,
};


export default AppBar;

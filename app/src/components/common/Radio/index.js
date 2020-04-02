import React from 'react';
import PropTypes from 'prop-types';
import styles from './Radio.module.sass';

const CustomRadio = ({ label, input, meta: { touched, error } }) => {
    return (
        <div className={styles.root}>
            <div className={styles.group}>
                <input type="radio" className={styles.hidden} id={label} {...input}/>
                <span className={styles.radio}/>
                <label htmlFor={label}>{label}</label>
            </div>
            {touched && ((error && <div className={styles.error}>{error}</div>))}
        </div>
    );
};

CustomRadio.propTypes = {
    label: PropTypes.any,
};

export default CustomRadio;

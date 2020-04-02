import React from 'react';
import PropTypes from 'prop-types';
import styles from './Checkbox.module.sass';

const CustomCheckbox = ({ label, input, meta: { touched, error } }) => {
    return (
        <div className={styles.root}>
            <label>
                <p>{label}</p>
                <input type='checkbox' {...input}/>
                <span className={styles.checkMark}/>
            </label>
            {touched && ((error && <div className={styles.error}>{error}</div>))}
        </div>
    );
};

CustomCheckbox.propTypes = {
    label: PropTypes.any,
};

export default CustomCheckbox;

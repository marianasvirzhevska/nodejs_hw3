import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.sass';

const Input = ({ input, label, type, placeholder, multiLine, rows, disabled, meta: { touched, error } }) => {
    return (
        <div className={styles.root}>
            <label>
                <p>{label}</p>
                <div className={styles.cover}>
                    {
                        multiLine ?
                            <textarea {...input} rows={rows} placeholder={placeholder}/> :
                            disabled ?
                                <input
                                    {...input} placeholder={placeholder} type={type} disabled
                                /> :
                                <input
                                    {...input} placeholder={placeholder} type={type}
                                />
                    }
                </div>
                {touched && ((error && <div className={styles.error}>{error}</div>))}
            </label>
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'file', 'date', 'url']),
    placeholder: PropTypes.string,
    multiLine: PropTypes.bool,
    rows: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Input;

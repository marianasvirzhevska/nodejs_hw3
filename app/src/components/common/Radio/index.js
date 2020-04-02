import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import styles from './Radio.module.sass';

const CustomRadio = ({ name, options }) => {
    return (
        <div className={styles.root}>
            <Field
                component={({ input, options }) => (
                    options.map((option) => <div key={option.id} className={styles.group}>
                        <input
                            id={option.id}
                            type='radio'
                            {...input}
                            className={styles.hidden}
                            value={option.value}
                            checked={option.value === input.value}
                        />
                        <span className={styles.radio}/>
                        <label htmlFor={option.id}>{option.label}</label>
                    </div>)
                )}
                name={name}
                options={options}
            />
        </div>
    );
};

CustomRadio.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
};

export default CustomRadio;

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { connect, useSelector } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';

import * as api from '../../utils/apiRequest';
import trim from '../../utils/trim';

import Input from '../common/Input';

let ChangePassword = (props) => {
    const { invalid, submitting, pristine, handleCancel } = props;
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(null);

    const formValues = useSelector((state) => getFormValues('change-pass')(state));

    const changePWRequest = (query) => {
        api.requestWithToken('/change-pass', 'PUT', query)
            .then((res) => {
                if (res.status !== 200) {
                    setError(true);
                } else {
                    setError(false);
                }
                return res.json();
            })
            .then((res) => {
                if (error) {
                    setMessage(res.status);
                } else {
                    setMessage(res.status);
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const changePassword = (e) => {
        e.preventDefault();
        const query = { ...formValues };

        changePWRequest(query);
    };

    return (
        <div className="form">
            <h2 className="subtitle">Change password</h2>
            <form className="auth-form register" onSubmit={changePassword}>
                <Field
                    component={Input}
                    name="password"
                    fullWidth
                    type="password"
                    placeholder="Enter new password"
                />
                <Field
                    component={Input}
                    name="password_repeat"
                    fullWidth
                    type="password"
                    placeholder="Repeat new password"
                />
                {error ? <p className="error">{message}</p> : null}
                {!error && message ? <p className="response">{message}</p> : null}
                <div className="form-actions">
                    {
                        !error && !message || error && message ?
                            <>
                                <Button
                                    disabled={invalid|| submitting || pristine}
                                    size="small"
                                    type="submit"
                                    color="secondary"
                                    variant="contained">
                                    Change password
                                </Button>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </> :
                            !error && message ?
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleCancel}>
                                    Ok
                                </Button> :
                                null
                    }
                </div>
            </form>
        </div>
    );
};

const validate = (_values) => {
    const values = trim(_values);
    const errors = {};

    const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!values.password) {
        errors.password = 'Password field cannot be blank.';
    } else if (values.password.length < 8) {
        errors.password = 'Password should contain at least 8 characters.';
    } else if (!PASSWORD_PATTERN.test(values.password)) {
        errors.password = 'Password should contain at least one letter and one number.';
    }

    if (!values.password_repeat) {
        errors.password_repeat = 'Confirm your password.';
    } else if (values.password_repeat.length < 8) {
        errors.password_repeat = 'Password should contain at least 8 characters.';
    }

    if (values.password_repeat && values.password && values.password_repeat !== values.password) {
        errors.password_repeat = 'Confirm your password correctly.';
    }

    return errors;
};

ChangePassword = reduxForm({
    form: 'change-pass',
    validate,
})(ChangePassword);


export default connect((state) => ({
    values: getFormValues('change-pass')(state),
}))(ChangePassword);

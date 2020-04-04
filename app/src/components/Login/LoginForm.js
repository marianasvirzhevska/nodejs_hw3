import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import trim from '../../utils/trim';
import setUser from '../../utils/setUser';
import * as api from '../../utils/apiRequest';
import { login } from '../../store/actions';

import Input from '../common/Input';

let LoginForm = (props) => {
    const { invalid, submitting, pristine } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const [error, setError] = useState(null);

    const formValues = useSelector((state) => getFormValues('login')(state));

    const loginRequest = (user) => {
        api.request('/login', 'POST', user)
            .then((res) => res.json())
            .then((res) => {
                if (!res.user) {
                    setError(res.status);
                } else {
                    setUser(res.user);
                    dispatch(login());

                    history.push('/profile');
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = { ...formValues };

        setError(null);
        loginRequest(user);
    };

    return (
        <div className="form-control">
            <form className="auth-form loginForm" onSubmit={handleSubmit}>
                <Field
                    component={Input}
                    name="email"
                    type="email"
                    fullWidth
                    label="Enter your Email"
                />
                <Field
                    component={Input}
                    name="password"
                    type="password"
                    fullWidth
                    label="Enter password"
                />
                {error ? <p className="error">{error}</p> : null}
                <div className="form-btn">
                    <Button
                        disabled={invalid|| submitting || pristine}
                        type="submit" variant="contained" color="secondary">
                            Login
                    </Button>
                </div>
            </form>
        </div>
    );
};

const validate = (_values) => {
    const values = trim(_values);
    const errors = {};

    const EMAIL_PATTERN = new RegExp('^[-!#$%&\'*+\\/0-9=?A-Z^_a-z{|}~](\\.?[-!#$%&\'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\\.?[a-zA-Z0-9])*\\.[a-zA-Z](-?[a-zA-Z0-9])+$');

    if (!values.email) {
        errors.email = 'E-mail field cannot be blank';
    } else if (!EMAIL_PATTERN.test(values.email)) {
        errors.email = 'E-mail is incorrect';
    }

    if (!values.password) {
        errors.password = 'Password field cannot be blank';
    } else if (values.password.length < 8) {
        errors.password = 'Password should contain at least 8 characters';
    }

    return errors;
};

LoginForm = reduxForm({
    form: 'login',
    validate,
})(LoginForm);

export default connect((state) => ({
    values: getFormValues('login')(state),
}))(LoginForm);

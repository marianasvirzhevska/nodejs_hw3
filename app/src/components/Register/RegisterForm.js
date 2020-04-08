import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';

import setUser from '../../utils/setUser';
import * as api from '../../utils/apiRequest';
import trim from '../../utils/trim';
import { login } from '../../store/actions';
import { USER_ROLE } from '../../constants';

import Input from '../common/Input';
import RadioButtons from '../common/Radio';

let RegisterForm = (props) => {
    const { invalid, submitting, pristine } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const [error, setError] = useState(null);

    const registerRequest = (user) => {
        api.request('/api/auth/register', 'POST', user)
            .then((res) => res.json())
            .then((res) => {
                if (!res.token) {
                    setError(res.status);
                } else {
                    setUser(res.token);
                    dispatch(login());

                    history.push('/profile');
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const formValues = useSelector((state) => getFormValues('register')(state));

    const register = (e) => {
        e.preventDefault();
        const user = {
            username: formValues.email,
            password: formValues.password,
            role: formValues.role,
        };

        setError(null);
        registerRequest(user);
    };

    const roleOptions = [
        {
            id: 'role-shipper',
            label: 'Shipper',
            value: `${ USER_ROLE.SHIPPER }`,
        },
        {
            id: 'role-driver',
            label: 'Driver',
            value: `${ USER_ROLE.DRIVER }`,
        },
    ];

    return (
        <div className="form-control">
            <form className="auth-form register" onSubmit={register}>
                <div className="form-row">
                    <RadioButtons name="role" options={roleOptions}/>
                </div>
                <Field
                    component={Input}
                    name="email"
                    fullWidth
                    type="email"
                    placeholder="Email"
                />
                <Field
                    component={Input}
                    name="phone"
                    fullWidth
                    type="text"
                    placeholder="Phone"
                />
                <div className="form-row">
                    <Field
                        component={Input}
                        name="firstName"
                        fullWidth
                        type="text"
                        placeholder="First name"
                    />
                    <Field
                        component={Input}
                        name="lastName"
                        fullWidth
                        type="text"
                        placeholder="Last name"
                    />
                </div>
                <div className="form-row">
                    <Field
                        component={Input}
                        name="password"
                        fullWidth
                        type="password"
                        placeholder="Enter password"
                    />
                    <Field
                        component={Input}
                        name="password_repeat"
                        fullWidth
                        type="password"
                        placeholder="Repeat password"
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="form-btn">
                    <Button
                        disabled={invalid|| submitting || pristine}
                        type="submit" variant="contained" color="secondary">
                        Register
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
    const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!values.email) {
        errors.email = 'E-mail field cannot be blank';
    } else if (!EMAIL_PATTERN.test(values.email)) {
        errors.email = 'E-mail is incorrect';
    }

    if (!values.password) {
        errors.password = 'Password field cannot be blank';
    } else if (values.password.length < 8) {
        errors.password = 'Password should contain at least 8 characters';
    } else if (!PASSWORD_PATTERN.test(values.password)) {
        errors.password = 'Password should contain at least one letter and one number';
    }

    if (!values.password_repeat) {
        errors.password_repeat = 'Confirm your password correctly';
    } else if (values.password_repeat.length < 8) {
        errors.password_repeat = 'Confirm your password correctly';
    }

    if (values.password_repeat && values.password && values.password_repeat !== values.password) {
        errors.password_repeat = 'Confirm your password correctly';
    }

    if (!values.role) {
        errors.role = 'Choose user role.';
    }

    return errors;
};

RegisterForm = reduxForm({
    form: 'register',
    validate,
})(RegisterForm);


export default connect((state) => ({
    values: getFormValues('register')(state),
}))(RegisterForm);

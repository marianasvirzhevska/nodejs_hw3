import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import setUser from '../../utils/setUser';
import trim from '../../utils/trim';
import useRegisterForm from './useRegister';
import Input from '../common/Input';
import CustomRadio from '../common/Radio';
import { registerUser } from '../../store/actions';
import { USER_ROLE } from '../../constants';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

let RegisterForm = (props) => {
    const { invalid, submitting, pristine } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const register = (formData) => {
        const user = { ...formData };

        console.log('user', user);

        // setUser(user);
        // dispatch(registerUser(user));
        // history.push('/dashboard');
    };

    const { inputs, handleInput, handleSubmit } = useRegisterForm(register);

    return (
        <div className="form-control">
            <form className="auth-form register" onSubmit={handleSubmit}>
                <div className="form-row">
                    {/* <Field
                        component={CustomRadio}
                        name="role"
                        label='Shipper'
                        props={{ value: '123' }}
                        onChange={handleInput}
                    /> */}
                    <Field name="sex" component={RadioGroup} onChange={handleInput}>
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </Field>
                    {/* <Field
                        component={CustomRadio}
                        name="role"
                        label='Driver'
                        props={{ value: '222' }}
                        onChange={handleInput}
                    /> */}
                </div>
                <Field
                    component={Input}
                    name="email"
                    fullWidth
                    type="email"
                    placeholder='Email'
                    onChange={handleInput}
                    value={inputs.email}
                />
                <Field
                    component={Input}
                    name="phone"
                    fullWidth
                    type="text"
                    placeholder='Phone'
                    onChange={handleInput}
                    value={inputs.phone}
                />
                <div className="form-row">
                    <Field
                        component={Input}
                        name="firstName"
                        fullWidth
                        type="text"
                        placeholder='First name'
                        onChange={handleInput}
                        value={inputs.firstName}
                    />
                    <Field
                        component={Input}
                        name="lastName"
                        fullWidth
                        type="text"
                        placeholder='Last name'
                        onChange={handleInput}
                        value={inputs.lastName}
                    />
                </div>
                <div className="form-row">
                    <Field
                        component={Input}
                        name="password"
                        fullWidth
                        type="password"
                        placeholder='Password'
                        onChange={handleInput} value={inputs.password}
                    />
                    <Field
                        component={Input}
                        name="passwordConfirm"
                        fullWidth
                        type='password'
                        placeholder='Repeat password'
                        onChange={handleInput} value={inputs.passwordConfirm}
                    />
                </div>
                <div className="form-btn">
                    <Button
                        disabled={invalid|| submitting || pristine}
                        type="submit" variant="contained" color='secondary'>
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

    if (!values.phone) {
        errors.phone = 'Phone field cannot be blank';
    }

    if (!values.firstName) {
        errors.firstName = 'First Name field cannot be blank';
    }

    if (!values.lastName) {
        errors.lastName = 'Last Name field cannot be blank';
    }
    if (!values.email) {
        errors.email = 'E-mail field cannot be blank';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'E-mail is incorrect';
    }

    if (!values.password) {
        errors.password = 'Password field cannot be blank';
    } else if (values.password.length < 6) {
        errors.password = 'Password should contain at least 6 characters';
    }

    if (!values.passwordConfirm) {
        errors.passwordConfirm = 'Confirm your password correctly';
    } else if (values.passwordConfirm.length < 6) {
        errors.passwordConfirm = 'Confirm your password correctly';
    }

    if (values.passwordConfirm && values.password && values.passwordConfirm !== values.password) {
        errors.passwordConfirm = 'Confirm your password correctly';
    }

    // if (!values.role) {
    //     errors.role = 'Choose user role.';
    // }

    return errors;
};

RegisterForm = reduxForm({
    form: 'register',
    validate,
})(RegisterForm);


export default RegisterForm;

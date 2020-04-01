import React from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { login, editUser } from '../../store/actions';
import trim from '../../utils/trim';
// import setUser from '../../utils/setUser';
import Input from '../common/Input';

let LoginForm = (props) => {
    const { invalid, submitting, pristine } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const formValues = useSelector((state) => getFormValues('login')(state));

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(e);
        // setUser(user);
        // dispatch(login(user));

        // history.push('/dashboard');
    };

    return (
        <div className="form-control">
            <form className="auth-form loginForm" onSubmit={handleSubmit}>
                <Field
                    component={Input}
                    name="email"
                    type="email"
                    fullWidth
                    label='Enter your Email'
                />
                <Field
                    component={Input}
                    name="password"
                    type="password"
                    fullWidth
                    label='Enter password'
                />
                <div className="form-btn">
                    <Button
                        disabled={invalid|| submitting || pristine}
                        type="submit" variant="contained" color='secondary'>
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
        errors.passwordConfirm = 'Confirm your password';
    } else if (values.passwordConfirm.length < 6) {
        errors.passwordConfirm = 'Confirm your password correctly';
    }

    if (values.passwordConfirm && values.password && values.passwordConfirm !== values.password) {
        errors.passwordConfirm = 'Confirm your password correctly';
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

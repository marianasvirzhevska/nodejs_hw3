import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';

import Input from '../../common/Input';
import trim from '../../../utils/trim';
import { editUser } from '../../../store/actions';
import * as api from '../../../utils/apiRequest';

let Form = ({ invalid, submitting, handleClose, user }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const formValues = useSelector((state) => getFormValues('editUser')(state));

    const editRequest = (user) => {
        api.request('/profile', 'PUT', user)
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
                    dispatch(editUser(user));
                    handleClose();
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const _user = { ...user, ...formValues };

        editRequest(_user);
        // handleClose();
    };

    return (
        <form className="dialog-form" onSubmit={handleCreate}>
            <div className="flexed-row">
                <div className="half-column">
                    <Field component={Input}
                        name="firstName"
                        type="text"
                        label="User First name"
                        placeholder="Please enter"
                    />
                </div>
                <div className="half-column">
                    <Field component={Input}
                        type="text"
                        name="lastName"
                        label="User Last name"
                        placeholder="Please enter"
                    />
                </div>
            </div>
            <div className="flexed-row">
                <Field component={Input}
                    name="phone"
                    type="text"
                    label="User Phone"
                />
            </div>
            <div className="flexed-row">
                <Field component={Input}
                    name="email"
                    type="email"
                    label="User Email"
                    disabled={true}
                />
            </div>
            <div className="flexed-row">
                <Field component={Input}
                    name="role"
                    type="text"
                    label="User Role"
                    disabled={true}
                />
            </div>
            {error ? <p className="error">{message}</p> : null}
            <div className='dialog-action'>
                <Button
                    color='secondary'
                    variant='contained'
                    type="submit"
                    disabled={invalid|| submitting}
                >Save</Button>
            </div>
        </form>
    );
};

function validate(_values) {
    const values = trim(_values);
    const errors = {};

    if (!values.firstName) {
        errors.firstName='User Name field cannot be blank';
    }
    if (!values.lastName) {
        errors.lastName='User Surname form field cannot be blank';
    }

    if (!values.phone) {
        errors.phone = 'Phone field cannot be blank';
    }

    return errors;
}

Form = reduxForm({
    form: 'editUser',
    validate,
})(Form);


export default connect((state) => ({
    values: getFormValues('editUser')(state),
}))(Form);



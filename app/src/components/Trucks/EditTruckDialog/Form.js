import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';

import trim from '../../../utils/trim';
import { editTruck } from '../../../store/actions';
import * as api from '../../../utils/apiRequest';
import truckMap from '../../../utils/getTruck';
import { TRUCK_TYPE } from '../../../constants';

import Input from '../../common/Input';
import SelectField from '../../common/SelectField';

let Form = ({ invalid, submitting, handleClose, truck }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const formValues = useSelector((state) => getFormValues('editTruck')(state));

    const editRequest = (truck) => {
        api.requestWithToken('/api/trucks', 'PUT', truck)
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
                    dispatch(editTruck(truck));
                    handleClose();
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        const query = {
            ...formValues,
            _id: truck._id,
        };

        editRequest(query);
    };

    const getTruckSize = () => {
        if (formValues && formValues.type) {
            return truckMap[formValues.type];
        }
        return truckMap[truck.type];
    };

    const truckTypes = [
        { label: TRUCK_TYPE.SPRINTER },
        { label: TRUCK_TYPE.SMALL_STRAIGHT },
        { label: TRUCK_TYPE.LARGE_STRAIGHT },
    ];

    return (
        <form className="dialog-form" onSubmit={handleEdit}>
            <div className="flexed-row">
                <Field component={Input}
                    name="name"
                    type="text"
                    label="Truck name:"
                    placeholder="Please enter"
                />
            </div>
            <div className="flexed-row">
                <Field
                    name="type"
                    component={SelectField}
                    fullWidth
                    label="Select truck type"
                    items={truckTypes}
                />
            </div>
            {
                getTruckSize() ?
                    <div className="item-info">
                        <div className="info-label">Width: <b>{getTruckSize().dimensions.width} cm</b></div>
                        <div className="info-label">Height: <b>{getTruckSize().dimensions.height} cm</b></div>
                        <div className="info-label">Length: <b>{getTruckSize().dimensions.length} cm</b></div>
                        <div className="info-label">Payload: <b>{getTruckSize().payload} kg</b></div>
                    </div> :
                    null
            }
            {error ? <p className="error">{message}</p> : null}
            <div className="dialog-action">
                <Button
                    color="secondary"
                    variant="contained"
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

    if (!values.name) {
        errors.name='Load Name field cannot be blank.';
    }
    if (!values.type) {
        errors.type='Select truck type.';
    }

    return errors;
}

Form = reduxForm({
    form: 'editTruck',
    validate,
})(Form);


export default connect((state) => ({
    values: getFormValues('editTruck')(state),
}))(Form);



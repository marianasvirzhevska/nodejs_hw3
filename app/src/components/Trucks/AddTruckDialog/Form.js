import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';

import trim from '../../../utils/trim';
import { createTruck } from '../../../store/actions';
import * as api from '../../../utils/apiRequest';
import truckMap from '../../../utils/getTruck';
import { TRUCK_TYPE, TRUCK_STATUS } from '../../../constants';

import Input from '../../common/Input';
import SelectField from '../../common/SelectField';

let Form = ({ invalid, submitting, handleClose }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const formValues = useSelector((state) => getFormValues('addTruck')(state));

    const createRequest = (truck) => {
        api.requestWithToken('/api/trucks', 'POST', truck)
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
                    const newTruck = {
                        ...truck,
                        name: 'Default truck',
                        status: TRUCK_STATUS.IN_SERVICE,
                    };

                    // previously newTruck received from server response - See development branch
                    dispatch(createTruck(newTruck));
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

        createRequest(formValues);
    };

    const getTruckSize = () => {
        if (formValues && formValues.type) {
            const truck = truckMap[formValues.type];
            return truck;
        }
        return null;
    };

    const truckTypes = [
        { label: TRUCK_TYPE.SPRINTER },
        { label: TRUCK_TYPE.SMALL_STRAIGHT },
        { label: TRUCK_TYPE.LARGE_STRAIGHT },
    ];

    return (
        <form className="dialog-form" onSubmit={handleCreate}>
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

    if (!values.type) {
        errors.type='Select truck type.';
    }

    return errors;
}

Form = reduxForm({
    form: 'addTruck',
    validate,
})(Form);


export default connect((state) => ({
    values: getFormValues('addTruck')(state),
}))(Form);



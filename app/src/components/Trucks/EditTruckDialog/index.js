import React from 'react';
import PropTypes from 'prop-types';
import { AppDialog, AppDialogTitle, AppDialogContent } from '../../common/Dialog';
import Form from './Form';

const AddTruckDialog = (props) => {
    const { open, handleClose, truck } = props;
    const initialValues = {
        name: truck && truck.name,
        type: truck && truck.type,
    };

    return (
        <AppDialog
            open={open}
            handleClose={handleClose}
        >
            <AppDialogTitle
                handleClose={handleClose}
                title='Create Load'/>
            <AppDialogContent>
                <Form
                    truck={truck}
                    initialValues={initialValues}
                    handleClose={handleClose}
                />
            </AppDialogContent>
        </AppDialog>
    );
};

AddTruckDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddTruckDialog;


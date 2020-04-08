import React from 'react';
import PropTypes from 'prop-types';
import { AppDialog, AppDialogTitle, AppDialogContent } from '../../common/Dialog';
import Form from './Form';

const AddTruckDialog = (props) => {
    const { open, handleClose } = props;

    return (
        <AppDialog
            open={open}
            handleClose={handleClose}
        >
            <AppDialogTitle
                handleClose={handleClose}
                title='Create Truck'/>
            <AppDialogContent>
                <Form
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


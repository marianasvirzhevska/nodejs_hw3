import React from 'react';
import PropTypes from 'prop-types';
import { AppDialog, AppDialogTitle, AppDialogContent } from '../../common/Dialog';
import Form from './Form';

const AddLoadDialog = (props) => {
    const { open, handleClose, load } = props;
    const initialValues = {
        name: load && load.name,
        payload: load && load.payload,
        width: load && load.dimensions.width,
        height: load && load.dimensions.height,
        length: load && load.dimensions.length,
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
                    load={load}
                    initialValues={initialValues}
                    handleClose={handleClose}
                />
            </AppDialogContent>
        </AppDialog>
    );
};

AddLoadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddLoadDialog;


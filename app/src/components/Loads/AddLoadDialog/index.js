import React from 'react';
import PropTypes from 'prop-types';
import { AppDialog, AppDialogTitle, AppDialogContent } from '../../common/Dialog';
import Form from './Form';

const AddLoadDialog = (props) => {
    const { open, handleClose } = props;

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


import React from 'react';
import PropTypes from 'prop-types';
import { AppDialog, AppDialogTitle, AppDialogContent } from '../../common/Dialog';
import Form from './Form';

const EditUserDialog = (props) => {
    const { open, handleClose, user } = props;

    const initialValues = {
        firstName: user && user.firstName,
        lastName: user && user.lastName,
        phone: user && user.phone,
        email: user && user.email,
        role: user && user.role,
    };

    return (
        <AppDialog
            open={open}
            handleClose={handleClose}
        >
            <AppDialogTitle
                handleClose={handleClose}
                title='Edit Profile'/>
            <AppDialogContent>
                <Form
                    user={user}
                    initialValues={initialValues}
                    handleClose={handleClose}
                />
            </AppDialogContent>
        </AppDialog>
    );
};

EditUserDialog.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default EditUserDialog;


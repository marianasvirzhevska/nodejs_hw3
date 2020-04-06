import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { AppDialog } from '../../common/Dialog';
import deleteIcon from '../../../assets/icons/ico-trash.svg';

const DeleteDialog = (props) => {
    const { open, handleClose, user, handleDelete } = props;

    return (
        <AppDialog
            open={open}
            handleClose={handleClose}
        >
            <div className="delete-container">
                <img src={deleteIcon} alt=""/>
                <h3 className="delete-title">Delete Account</h3>
                <div className="user-info">
                    <div className="task-details">
                        <h4>{user && user.email}</h4>
                        <p>{user && user.role}</p>
                    </div>
                </div>
                <Button
                    variant="contained"
                    onClick={handleDelete}
                    className="delete-button"
                >Delete</Button>
                <Button
                    onClick={handleClose}
                    className="cancel-button"
                >Cancel</Button>
            </div>
        </AppDialog>
    );
};

DeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    task: PropTypes.object,
};

export default DeleteDialog;


import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';

import { LOAD_STATUS } from '../../constants';
import * as api from '../../utils/apiRequest';
import { deleteLoad, editLoad } from '../../store/actions';
import EditLoadDialog from './EditLoadDialog';

const LoadItem = ({ load, setSnackbar, setMessage }) => {
    const dispatch = useDispatch();
    const { _id, name, payload, dimensions, status, state } = load;

    const [error, setError] = useState(false);
    const [editDialog, setEditDialog] = useState(false);

    const postRequest = (id) => {
        const url = `/api/loads/${id}/post`;
        api.requestWithToken(url, 'PATCH')
            .then((res) => res.json())
            .then((res) => {
                const resQuery = res.assigned_to;
                const postedLoad = {
                    ...resQuery,
                    _id: id,
                };

                // setMessage(res.message);
                // setSnackbar(true);
                dispatch(editLoad(postedLoad));
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const postLoad = () => {
        postRequest(_id);
    };

    const deleteLoadRequest = (query) => {
        api.requestWithToken('/loads', 'DELETE', query)
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteLoad(query));
                setMessage(res.message);
                setSnackbar(true);
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleDelete = () => {
        const query = { _id };
        deleteLoadRequest(query);
    };

    const handleEdit = () => {
        setEditDialog(!editDialog);
    };

    return (
        <li id={_id} className="list-item">
            <div className="item-label">{name} <span className="light">({status})</span></div>
            {
                state ?
                    <>
                        <div className="state">{state}</div>
                    </> :
                    null
            }
            <div className="item-info">
                <div className="info-label">Width: <b>{dimensions.width} cm</b></div>
                <div className="info-label">Height: <b>{dimensions.height} cm</b></div>
                <div className="info-label">Length: <b>{dimensions.length} cm</b></div>
                <div className="info-label">Payload: <b>{payload} kg</b></div>
            </div>
            <div className="item-actions">
                {
                    status === LOAD_STATUS.NEW || status === LOAD_STATUS.SHIPPED ?
                        <IconButton
                            size="small"
                            aria-label="Delete"
                            onClick={handleDelete}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton> :
                        null
                }
                {
                    status === LOAD_STATUS.NEW ?
                        <>
                            <IconButton
                                size="small"
                                aria-label="Edit"
                                onClick={handleEdit}
                            >
                                <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="Post"
                                onClick={postLoad}
                            >
                                <DoneAllOutlinedIcon />
                            </IconButton>
                        </> :
                        null
                }
            </div>
            {error ? <p className="error">{error}</p> : null}
            <EditLoadDialog
                load={load}
                open={editDialog}
                setMessage={setMessage}
                setSnackbar={setSnackbar}
                handleClose={handleEdit}/>
        </li>
    );
};

export default LoadItem;

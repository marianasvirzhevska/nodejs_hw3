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

const LoadItem = ({ load }) => {
    const dispatch = useDispatch();
    const { _id, name, payload, dimensions, status, state } = load;

    const [error, setError] = useState(false);
    const [editDialog, setEditDialog] = useState(false);

    const postRequest = (query) => {
        api.requestWithToken('/loads', 'PATCH', query)
            .then((res) => res.json())
            .then((res) => {
                const postedLoad = {
                    ...query,
                    status: LOAD_STATUS.POSTED,
                };
                dispatch(editLoad(postedLoad));
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const postLoad = () => {
        const query = { _id };
        postRequest(query);
    };

    const deleteLoadRequest = (query) => {
        api.requestWithToken('/loads', 'DELETE', query)
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteLoad(query));
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
            {
                status !== LOAD_STATUS.POSTED ?
                    <div className="item-actions">
                        <IconButton
                            size="small"
                            aria-label="Delete"
                            onClick={handleDelete}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
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
                    </div> :
                    null
            }
            {error ? <p className="error">{error}</p> : null}
            <EditLoadDialog
                load={load}
                open={editDialog}
                handleClose={handleEdit}/>
        </li>
    );
};

export default LoadItem;

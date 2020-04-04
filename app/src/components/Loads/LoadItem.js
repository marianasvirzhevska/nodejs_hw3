import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';

import { LOAD_STATUS } from '../../constants';
import * as api from '../../utils/apiRequest';
// import { getServerLoads } from '../../store/actions';
import EditLoadDialog from './EditLoadDialog';

const LoadItem = ({ load }) => {
    // const dispatch = useDispatch();
    const { _id, name, payload, dimensions, status, state } = load;

    const [error, setError] = useState(false);
    const [message, setMessage] = useState(null);
    const [editDialog, setEditDialog] = useState(false);

    const postRequest = (query) => {
        api.requestWithToken('/loads', 'PATCH', query)
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
                    setMessage(res.status);
                }
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
                    setMessage(res.status);
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const deleteLoad = () => {
        const query = { _id };
        deleteLoadRequest(query);
    };

    const editRequest = (query) => {
        api.requestWithToken('/loads', 'PUT', query)
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
                    setMessage(res.status);
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
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
                            onClick={deleteLoad}
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
            {error ? <p className="error">{message}</p> : null}
            {!error && message ? <p className="response">{message}</p> : null}
            <EditLoadDialog
                load={load}
                open={editDialog}
                handleClose={handleEdit}/>
        </li>
    );
};

export default LoadItem;

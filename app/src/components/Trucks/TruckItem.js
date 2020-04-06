import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';

import * as api from '../../utils/apiRequest';
import truckMap from '../../utils/getTruck';
import { assignTruck, deleteTruck } from '../../store/actions';
import EditTruckDialog from './EditTruckDialog';

const TruckItem = ({ truck }) => {
    const dispatch = useDispatch();
    const { _id, name, type, status, assigned_to: assignedLoad } = truck;

    const user = useSelector((state) => state.user.userInfo);

    const [error, setError] = useState(false);
    const [editDialog, setEditDialog] = useState(false);

    const assignRequest = (query) => {
        api.requestWithToken('/trucks', 'PATCH', query)
            .then((res) => res.json())
            .then((res) => {
                dispatch(assignTruck(query));
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleAssign = () => {
        const query = { _id };
        assignRequest(query);
    };

    const deleteTruckRequest = (query) => {
        api.requestWithToken('/trucks', 'DELETE', query)
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteTruck(query));
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleDelete = () => {
        const query = { _id };
        deleteTruckRequest(query);
    };

    const handleEdit = () => {
        setEditDialog(!editDialog);
    };

    const getTruckSize = () => {
        return truckMap[type];
    };

    return (
        <li id={_id} className="list-item">
            <div className="item-label">{name}
                <span className="light"> ({status})</span>
                {assignedLoad ?<span className="assigned-truck"> - Assigned</span>: null}
            </div>
            <div className="item-info">
                <div className="info-label">Type: <b>{type}</b></div>
            </div>
            <div className="item-info">
                <div className="info-label">Width: <b>{getTruckSize().dimensions.width} cm</b></div>
                <div className="info-label">Height: <b>{getTruckSize().dimensions.height} cm</b></div>
                <div className="info-label">Length: <b>{getTruckSize().dimensions.length} cm</b></div>
                <div className="info-label">Payload: <b>{getTruckSize().payload} kg</b></div>
            </div>
            {
                !assignedLoad && !user.assigned_load ?
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
                            aria-label="Assign"
                            onClick={handleAssign}
                        >
                            <AssignmentIndOutlinedIcon />
                        </IconButton>
                    </div> :
                    null
            }
            {error ? <p className="error">{error}</p> : null}
            <EditTruckDialog
                truck={truck}
                open={editDialog}
                handleClose={handleEdit}/>
        </li>
    );
};

export default TruckItem;

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import { LOAD_STATUS } from '../../constants';

const LoadItem = ({ load }) => {
    const { _id, name, payload, dimensions, status, state } = load;

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
                            // onClick={handleCreate}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            aria-label="Edit"
                            // onClick={handleCreate}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            aria-label="Post"
                            // onClick={handleCreate}
                        >
                            <DoneAllOutlinedIcon />
                        </IconButton>
                    </div> :
                    null
            }
        </li>
    );
};

export default LoadItem;

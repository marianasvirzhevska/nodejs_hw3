import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { USER_ROLE } from '../../constants';
import ChangePWForm from './ChangePWForm';

const UserInfo = ({ user }) => {
    const [newPasForm, setEditPW] = useState(false);

    const handleEdit = () => {
        setEditPW(!newPasForm);
    };

    return (
        <div className="info">
            <div className="info--row">
                <div className="info--label">User name:</div>
                <div className="info--description">{user.firstName} {user.lastName}</div>
            </div>
            <div className="info--row">
                <div className="info--label">User role:</div>
                <div className="info--description">{user.role}</div>
            </div>
            <div className="info--row">
                <div className="info--label">User email:</div>
                <div className="info--description">{user.email}</div>
            </div>
            <div className="info--row">
                <div className="info--label">User phone:</div>
                <div className="info--description">{user.phone}</div>
            </div>
            {
                user.role === USER_ROLE.DRIVER ?
                    <div className="info--row">
                        <div className="info--label">Assigned load:</div>
                        <div className="info--description">
                            {
                                user.assigned_load ?
                                    <Link to={`trucks/load-info/${user.assigned_load}`}>View</Link> :
                                    'No assigned load.'
                            }
                        </div>
                    </div> :
                    null
            }
            {
                user.role === USER_ROLE.DRIVER ?
                    <div className="info--row">
                        <div className="info--label">Driver Trucks:</div>
                        <div className="info--description"><Link to="/trucks">Go to Trucks</Link></div>
                    </div> :
                    <div className="info--row">
                        <div className="info--label">Shipper Loads:</div>
                        <div className="info--description"><Link to="/loads">Go to Loads</Link></div>
                    </div>
            }
            <div className="info--row info--center">
                {
                    newPasForm && !user.assigned_load ?
                        <ChangePWForm user={user} handleCancel={handleEdit} /> :
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={Boolean(user.assigned_load)}
                            onClick={handleEdit}
                        >Change password</Button>
                }
            </div>
        </div>
    );
};

export default UserInfo;

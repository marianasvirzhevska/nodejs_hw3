import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { USER_ROLE } from '../../constants';

const UserInfo = ({ user }) => {
    const handleEdit = () => {
        console.log('edit');
    };

    return (
        <div className="info">
            <div className="info--row">
                <div className="info--label">User name:</div>
                <div className="info--description">{user.firstName} {user.firstName}</div>
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
            <div className="info--row info--center">
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleEdit}
                >Change password</Button>
            </div>
        </div>
    );
};

export default UserInfo;

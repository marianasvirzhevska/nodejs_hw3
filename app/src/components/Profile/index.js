import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as api from '../../utils/apiRequest';
import { getUserInfo } from '../../store/actions';

import AppBar from '../common/AppBar';
import UserInfo from './UserInfo';
import EditUserDialog from './EditUserDialog';

const Profile = () => {
    const dispatch = useDispatch();

    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [editDialog, setEditDialog] = useState(false);

    async function fetchData() {
        const res = await api.requestWithToken('/profile', 'GET');
        res
            .json()
            .then((res) => {
                setUser(res.userInfo);
                dispatch(getUserInfo(res.userInfo));
                setLoaded(true);
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = () => {
        setEditDialog(!editDialog);
    };


    return (
        <div className="root">
            <AppBar
                title={loaded ? user.role : 'Profile'}
            />
            <div className="container">
                <div className="container-fluid">
                    <div className="paper">
                        <div className="title-row">
                            <h1 className="title">User Info</h1>
                            {
                                loaded && !user.assigned_load ?
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={handleEdit}
                                    >Edit Profile</Button> :
                                    null
                            }
                        </div>
                        {
                            loaded ?
                                <UserInfo user={user}/> :
                                <p>Loading</p>
                        }
                        {error ? <p className="error">{error}</p> : null}
                    </div>
                </div>
            </div>
            <EditUserDialog
                user={user}
                open={editDialog}
                handleClose={handleEdit}
            />
        </div>
    );
};

export default Profile;

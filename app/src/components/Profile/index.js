import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import * as api from '../../utils/apiRequest';
import { getUserInfo } from '../../store/actions';
import { LOGOUT } from '../../store/constants';
import { USER_ROLE } from '../../constants';

import AppBar from '../common/AppBar';
import UserInfo from './UserInfo';
import EditUserDialog from './EditUserDialog';
import DeleteDialog from './DeleteDialog';

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const storeUser = useSelector((state) => state.user.userInfo);

    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    async function fetchData() {
        const res = await api.requestWithToken('/api/profile', 'GET');
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

    const handleOpenDelete = () => {
        setDeleteDialog(!deleteDialog);
    };

    const deleteRequest = () => {
        api.requestWithToken('/api/profile', 'DELETE', { _id: user._id })
            .then((res) => res.json())
            .then((res) => {
                dispatch({ type: LOGOUT });
                localStorage.removeItem('user');
                history.push('/register');
                return res;
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        setUser(storeUser);
    }, [storeUser]);

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
                            <div>
                                {
                                    loaded && user.role === USER_ROLE.SHIPPER ?
                                        <Button
                                            size="small"
                                            className="delete-button"
                                            onClick={handleOpenDelete}
                                        >Delete Account</Button> :
                                        null
                                }
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
            <DeleteDialog
                user={user}
                open={deleteDialog}
                handleClose={handleOpenDelete}
                handleDelete={deleteRequest}

            />
        </div>
    );
};

export default Profile;

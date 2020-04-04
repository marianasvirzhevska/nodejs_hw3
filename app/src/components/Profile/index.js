import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as api from '../../utils/apiRequest';

import AppBar from '../common/AppBar';
import UserInfo from './UserInfo';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    async function fetchData() {
        const res = await api.requestWithToken('/profile', 'GET');
        res
            .json()
            .then((res) => {
                setUser(res.userInfo);
                setLoaded(true);
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = () => {
        console.log('edit user');
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
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={handleEdit}
                            >Edit Profile</Button>
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
        </div>
    );
};

export default Profile;

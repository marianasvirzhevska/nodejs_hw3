import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
    const history = useHistory();

    const logout = () => {
        localStorage.removeItem('user');
        history.push('/');
    };

    return (
        <div>Dashboard page (private nested router)
            <button onClick={logout}>logout</button>
        </div>
    );
};
export default Dashboard;

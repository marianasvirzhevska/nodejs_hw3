import React from 'react';

const Login = () => {
    const login = () => {
        localStorage.setItem('user', 'user');
        if (true) return;
    };

    return (
        <div>
            Login page
            <button onClick={login}>login</button>
        </div>
    );
};

export default Login;

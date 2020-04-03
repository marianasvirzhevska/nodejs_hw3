import React from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import LoginForm from './LoginForm';

const Login = () => {
    // const login = () => {
    //     localStorage.setItem('user', 'user');
    //     if (true) return;
    // };

    return (
        <div className="auth-root">
            <div className="auth-image loginImg">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <div className="bottom-row">
                    <p>Copyright © 2020 Load Delivery Software Tools</p>
                    <Link to='/terms'>Terms and <br/>conditions</Link>
                </div>
            </div>
            <div className="form-cover loginForm">
                <h1 className="form-title">Login</h1>
                <LoginForm />
                <p className="reset-link">Don't have an account?
                    <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

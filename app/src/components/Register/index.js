import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import RegisterForm from './RegisterForm';

const Register = () => {
    return (
        <div className="auth-root">
            <div className="auth-image registerImg">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <div className="bottom-row">
                    <p>Copyright © 2020 Load Delivery Software Tools</p>
                    <Link to='/terms'>Terms and conditions</Link>
                </div>
            </div>
            <div className="form-cover registerForm">
                <h1 className="form-title">Registration</h1>
                <RegisterForm />
                <p className="reset-link">Have an account?
                    <Link to='/'>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

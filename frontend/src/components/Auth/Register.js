import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Register.css'; // External CSS file for styling

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', password2: '' });
    const [message, setMessage] = useState('');
    const { register, authState } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        if (password !== password2) {
            setMessage('Passwords do not match');
            return;
        }
        const success = await register(username, password);
        if (success) {
            navigate('/courses');
        } else {
            setMessage(authState.error || 'Registration failed. Please try again.');
        }
    };

    const isError = message.startsWith('Passwords') || authState.error;

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register</h2>
                {message && (
                    <p className={isError ? 'register-error' : 'register-success'}>
                        {message}
                    </p>
                )}
                <form onSubmit={onSubmit} className="register-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="password2"
                            value={password2}
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;

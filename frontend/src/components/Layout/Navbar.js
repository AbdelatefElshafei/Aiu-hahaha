import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { authState, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link">AIU.</Link>
            </div>

            <div className="navbar-links">
                {authState.loading ? (
                    <span className="loading-text">Loading...</span>
                ) : authState.isAuthenticated ? (
                    <ul>
                        <li className="welcome">👋 Hello, {authState.user?.username}</li>
                        <li><Link to="/chatbot">Chatbot</Link></li>
                        <li><Link to="/courses">All Courses</Link></li>
                        <li><Link to="/my-courses">My Courses</Link></li>
                        <li><a href="#logout" onClick={onLogout}>Logout</a></li>
                    </ul>
                ) : (
                    <ul>
                        <li><Link to="/chatbot">Chatbot</Link></li>
                        <li><Link to="/courses">All Courses</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

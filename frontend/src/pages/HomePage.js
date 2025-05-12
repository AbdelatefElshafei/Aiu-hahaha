import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // External CSS for styling

const HomePage = () => (
    <div className="home-container">
        <div className="home-card">
            <h1 className="home-title">Course Registration System</h1>
            <p className="home-subtitle">Welcome! Please log in or register to get started.</p>
            <div className="home-buttons">
                <Link to="/login" className="btn primary">Login</Link>
                <Link to="/register" className="btn secondary">Register</Link>
            </div>
            <p className="home-browse">
                <Link to="/courses">Browse available courses</Link>
            </p>
        </div>
    </div>
);

export default HomePage;

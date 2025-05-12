import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import MyCoursesPage from './pages/MyCoursesPage';

import './App.css'; 
import ChatbotPage from './pages/ChatbotPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container" style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/my-courses" element={<MyCoursesPage />} />
                        </Route>

                        <Route path="*" element={<div><h2>404 Not Found</h2><p>Sorry, this page does not exist.</p></div>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
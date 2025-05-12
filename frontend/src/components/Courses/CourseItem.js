import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { registerForCourse, dropRegisteredCourse } from '../../api';
import './CourseItem.css';

const CourseItem = ({ course, isRegistered, onActionSuccess }) => {
    const { authState } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setMessage('');
        setError('');
        try {
            await registerForCourse(course._id);
            setMessage(`✅ Successfully registered for ${course.name}`);
            onActionSuccess?.(course._id, 'register');
        } catch (err) {
            setError(err.response?.data?.msg || '❌ Failed to register');
        }
    };

    const handleDrop = async () => {
        setMessage('');
        setError('');
        try {
            await dropRegisteredCourse(course._id);
            setMessage(`ℹ️ Successfully dropped ${course.name}`);
            onActionSuccess?.(course._id, 'drop');
        } catch (err) {
            setError(err.response?.data?.msg || '❌ Failed to drop course');
        }
    };

    const isFull = (course.enrolledStudents?.length || 0) >= course.capacity;

    return (
        <div className="course-card">
            <div className="course-header">
                <h3>{course.name}</h3>
                <span className="course-id">#{course.courseId}</span>
            </div>
            <p className="course-desc">{course.description}</p>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            {authState.isAuthenticated ? (
                isRegistered ? (
                    <button className="btn drop" onClick={handleDrop}>
                        Drop Course
                    </button>
                ) : (
                    <button className="btn register" onClick={handleRegister} disabled={isFull}>
                        {isFull ? 'Full' : 'Register'}
                    </button>
                )
            ) : (
                <p className="auth-reminder">🔒 Login to register for courses.</p>
            )}
        </div>
    );
};

export default CourseItem;

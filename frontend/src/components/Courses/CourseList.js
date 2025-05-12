import React, { useState, useEffect, useContext } from 'react';
import { fetchAllCourses, fetchMyCourses } from '../../api';
import CourseItem from './CourseItem';
import { AuthContext } from '../../context/AuthContext';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [myCourseIds, setMyCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authState } = useContext(AuthContext);

    const loadCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const resAll = await fetchAllCourses();
            setCourses(resAll.data);

            if (authState.isAuthenticated) {
                const resMy = await fetchMyCourses();
                setMyCourseIds(new Set(resMy.data.map(c => c._id)));
            } else {
                setMyCourseIds(new Set());
            }
        } catch (err) {
            setError('Failed to fetch courses. ' + (err.response?.data?.msg || err.message));
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isAuthenticated]);

    const handleActionSuccess = (courseId, action) => {
        if (action === 'register') {
            setMyCourseIds(prev => new Set(prev).add(courseId));
        } else if (action === 'drop') {
            setMyCourseIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(courseId);
                return newSet;
            });
        }
    };

    return (
        <div className="course-list-container">
            <h2 className="course-list-title">Available Courses</h2>

            {loading ? (
                <div className="loading-container">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                </div>
            ) : error ? (
                <p className="error-message">❌ {error}</p>
            ) : courses.length === 0 ? (
                <p className="empty-message">🚫 No courses available at the moment.</p>
            ) : (
                <div className="course-grid">
                    {courses.map(course => (
                        <CourseItem
                            key={course._id}
                            course={course}
                            isRegistered={myCourseIds.has(course._id)}
                            onActionSuccess={handleActionSuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;

import React, { useState, useEffect, useContext } from 'react';
import { fetchMyCourses } from '../../api';
import CourseItem from './CourseItem';
import { AuthContext } from '../../context/AuthContext'; // To check if user is logged in

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authState } = useContext(AuthContext);

    const loadMyCourses = async () => {
        if (!authState.isAuthenticated) {
            setError("Please log in to see your courses.");
            setLoading(false);
            setMyCourses([]); // Clear courses if not authenticated
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetchMyCourses();
            setMyCourses(res.data);
        } catch (err) {
            setError('Failed to fetch your courses. ' + (err.response?.data?.msg || err.message));
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isAuthenticated]); // Reload when auth state changes


    const handleActionSuccess = (courseId, action) => {
        // For 'drop', remove from list. 'Register' shouldn't happen here but good to be robust.
        if (action === 'drop') {
            setMyCourses(prevCourses => prevCourses.filter(c => c._id !== courseId));
        }
        // loadMyCourses(); // Or just reload
    };


    if (loading) return <p>Loading your courses...</p>;
    if (error && !authState.isAuthenticated) return <p style={{ color: 'orange' }}>{error}</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;


    return (
        <div>
            <h2>My Registered Courses</h2>
            {myCourses.length === 0 ? (
                <p>You are not registered for any courses yet.</p>
            ) : (
                myCourses.map(course => (
                    <CourseItem
                        key={course._id}
                        course={course}
                        isRegistered={true} // Always true on this page
                        onActionSuccess={handleActionSuccess}
                    />
                ))
            )}
        </div>
    );
};

export default MyCourses;
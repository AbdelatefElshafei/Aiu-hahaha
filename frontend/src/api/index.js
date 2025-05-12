import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getLoggedInUser = () => api.get('/auth/me');

export const sendMessageToBot = (messageData) => api.post('/chatbot/respond', messageData);
export const fetchAllCourses = () => api.get('/courses');
export const registerForCourse = (courseId) => api.post(`/courses/${courseId}/register`);
export const dropRegisteredCourse = (courseId) => api.post(`/courses/${courseId}/drop`);
export const fetchMyCourses = () => api.get('/courses/my');
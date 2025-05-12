const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    registerCourse,
    dropCourse,
    getMyCourses,
    createCourse 
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.post('/:courseId/register', authMiddleware, registerCourse);
router.post('/:courseId/drop', authMiddleware, dropCourse);
router.get('/my', authMiddleware, getMyCourses);
router.post('/', authMiddleware, createCourse); 

module.exports = router;
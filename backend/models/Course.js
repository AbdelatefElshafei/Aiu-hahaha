const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseId: { 
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    capacity: {
        type: Number,
        default: 30,
    },
    enrolledStudents: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

module.exports = mongoose.model('Course', CourseSchema);
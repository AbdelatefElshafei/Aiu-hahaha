const Course = require('../models/Course');
const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().select('-enrolledStudents'); // Don't send enrolled students list to everyone
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.registerCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        const user = await User.findById(req.user.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.registeredCourses.includes(course._id) || course.enrolledStudents.includes(user._id)) {
            return res.status(400).json({ msg: 'Already registered for this course' });
        }

        if (course.enrolledStudents.length >= course.capacity) {
            return res.status(400).json({ msg: 'Course is full' });
        }

        user.registeredCourses.push(course._id);
        course.enrolledStudents.push(user._id);

        await user.save();
        await course.save();

        res.json({ msg: 'Successfully registered for course', course });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Course or User not found with given ID' });
        }
        res.status(500).send('Server Error');
    }
};


exports.dropCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        const user = await User.findById(req.user.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.registeredCourses.includes(course._id) && !course.enrolledStudents.includes(user._id)) {
            return res.status(400).json({ msg: 'Not registered for this course' });
        }

        user.registeredCourses = user.registeredCourses.filter(
            (courseId) => courseId.toString() !== course._id.toString()
        );
        course.enrolledStudents = course.enrolledStudents.filter(
            (userId) => userId.toString() !== user._id.toString()
        );

        await user.save();
        await course.save();

        res.json({ msg: 'Successfully dropped course', course });
    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Course or User not found with given ID' });
        }
        res.status(500).send('Server Error');
    }
};


exports.getMyCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('registeredCourses');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.registeredCourses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createCourse = async (req, res) => {
    const { courseId, name, description, capacity } = req.body;
    try {
        let course = await Course.findOne({ courseId });
        if (course) {
            return res.status(400).json({ msg: 'Course with this ID already exists' });
        }
        course = new Course({ courseId, name, description, capacity });
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
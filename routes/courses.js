const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth')
const { courseValidators } = require('../utils/validators')
const { validationResult } = require('express-validator')
const router = Router();

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .select('price title img')
            .populate('userId', 'email name');

        res.render('courses', {
            title: 'Course list',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        })
    } catch (e) {
        console.console.error(e);
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (req.query.allow === undefined) {
        return res.redirect('/');
    }

    try {
        const course = await Course.findById(req.params.id)

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        })
    } catch (e) {
        console.console.error(e);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            title: `Course ${course.title}`,
            layout: 'empty',
            course
        })
    } catch (e) {
        console.console.error(e);
    }
})

router.post('/edit', auth, courseValidators, async (req, res) => {
    const {id, ...data} = req.body
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow`)
    }

    try {
        const course = await Course.findById(id)

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        Object.assign(course, data)

        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.console.error(e);
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.console.error(e);
    }
})

module.exports = router
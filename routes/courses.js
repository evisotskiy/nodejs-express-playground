const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Course list',
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', async (req, res) => {
    if (req.query.allow === undefined) {
        return res.redirect('/');
    }
    const course = await Course.getById(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id)
    res.render('course', {
        title: `Course ${course.title}`,
        layout: 'empty',
        course
    })
})

router.post('/edit', async (req, res) => {
    await Course.update(req.body)
    res.redirect('/courses')
})

module.exports = router
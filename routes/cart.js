const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')

const router = Router()

const mapCartItems = ({ items }) => items.map(({ courseId, count }) => ({ ...courseId._doc, id: courseId.id, count }))
const computePrice = courses => courses.reduce((total, {price, count}) => total += price * count, 0)

router.get('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()

        const courses = mapCartItems(user.cart)

        res.render('cart', {
            title: 'Cart',
            isCart: true,
            courses,
            price: computePrice(courses)
        })
    } catch (e) {
        console.console.error(e);
    }
})

router.post('/add', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.body.id)
        await req.user.addToCart(course)
        res.redirect('/cart')
    } catch (e) {
        console.console.error(e);
    }
});

router.delete('/remove/:id', auth, async (req, res) => {
    try {
        await req.user.removeFromCart(req.params.id)
        const user = await req.user.populate('cart.items.courseId').execPopulate()

        const courses = mapCartItems(user.cart)
        const cart = { courses, price: computePrice(courses) }

        res.json(cart);
    } catch (e) {
        console.console.error(e);
    }
});

module.exports = router
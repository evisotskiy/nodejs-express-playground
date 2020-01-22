const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Enter correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('This email is already used')
                }
            } catch (e) {
                console.error(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Password must be at least 6 symbols and contain only numbers and letters')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords should be equal')
            }
            return true;
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name should be longer than 3 symbols')
];

exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Enter correct email')
        .normalizeEmail(),
];

exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Minimum title length is 3 symbols').trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct image url').isURL()
]
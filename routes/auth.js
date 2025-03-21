const express = require('express');
const { body, check } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
body('email')
  .isEmail()
  .withMessage('Please enter a valid email.')
  .custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject('E-mail address already exists!');
      }
    });
  })
  .normalizeEmail(),
body('password')
  .trim()
  .isLength({min: 7})
  .matches(/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/)
  .withMessage('Minimum length 7 and must include 1 special character.'),
body('username')
  .trim()
  .not()
  .isEmpty()
]
, authController.signup);

router.post('/login', authController.login );

module.exports = router;
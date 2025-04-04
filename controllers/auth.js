const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        username: username,
        password: hashedPw,
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User Created!', userId: result._id })
    })
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        const error = new Error('No user could be found with this email.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Invalid Password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          role: loadedUser.role,
          userId: loadedUser._id.toString()
        }, JWT_SECRET_KEY,
        { expiresIn: '1h'}
      );
      res.cookie('token', token, {
        maxAge: 60 * 1 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/login',
      });
      console.log(loadedUser);
      res.status(200).json({ 
        token: token, 
        userId: loadedUser._id.toString(), 
        username: loadedUser.username, 
        email: loadedUser.email,
        role: loadedUser.role
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    })
}

exports.getUser = (req, res, next) => {
  
}
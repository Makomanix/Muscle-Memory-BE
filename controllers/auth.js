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
    return next(error);
  }

  let tokens;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const newUser = new User({
        email: email,
        username: username,
        password: hashedPw,
        refreshToken: ''
      });

      tokens = newUser.generateAuthTokens();
      newUser.refreshTokens = [tokens.refreshToken];
      return newUser.save();
    })
    .then(savedUser => {
      res.cookie('jwtRefresh', tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.cookie('jwtAccess', tokens.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.status(201).json({ message: 'User Created!'})
    })
    .catch(error => {
      if(!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    })
};

exports.login = (req, res, next) => {
  const cookies = req.cookies;
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  let tokens;
  User.findOne({email: email})
    .then(user => {
      if (!user) {
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
      tokens = loadedUser.generateAuthTokens();
      console.log('just created R tokens', tokens.refreshToken)
      console.log('refresh cookie before replacement', cookies.jwtRefresh);
      loadedUser.refreshTokens = loadedUser.refreshTokens.filter((token) => token !== cookies.jwtRefresh);
      console.log('loadedUser.refreshTokens after filter', loadedUser.refreshTokens);
      loadedUser.refreshTokens.push(tokens.refreshToken);
      console.log('loadedUser.refreshTokens after adding in new gen token', loadedUser.refreshTokens);
      
      return loadedUser.save();
    })
    .then(savedUser => {
      res.cookie('jwtRefresh', tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.cookie('jwtAccess', tokens.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.status(200).json({ 
        userId: savedUser._id.toString(), 
        username: savedUser.username, 
        email: savedUser.email,
        role: savedUser.role
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    })
};

exports.getUser = (req, res, next) => {
  
}

exports.getAccess = (req, res, next) => {
  const refreshCookie = req.cookies.jwtRefresh;
  let tokens;
  console.log('refreshCookie', refreshCookie);
  console.log('typeof', typeof refreshCookie)
  User.findOne({refreshTokens: refreshCookie})
    .then(currentUser => {
      console.log('currentUser', currentUser);
      if (!currentUser) {
        const error = new Error('Unauthorize. No matching user found.');
        error.statusCode = 401
        console.log('I AM HERE')
        return next(error);
      }
      tokens = currentUser.generateAuthTokens();
      currentUser.refreshTokens = currentUser.refreshTokens.filter((token) => token !== refreshCookie);
      console.log("AM I HERE THOUGH?")
      currentUser.refreshTokens.push(tokens.refreshToken);
      console.log('tokens', tokens);

      return currentUser.save()
    })
    .then(savedUser => {
      //add check for 
      res.cookie('jwtRefresh', tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.cookie('jwtAccess', tokens.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'api.mm.local'
      });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Authentication tokens refreshed successfully.'
      });
      console.log("success")
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      console.log('error @ end of refresh', error);
      next(error);
    })
};
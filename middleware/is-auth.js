const jwt = require('jsonwebtoken');

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY

module.exports = (req, res, next) => {
  const accessToken = req.cookies.jwtAccess;
  console.log('accessToken', accessToken)
  if ( !accessToken) {
    console.log('req.body.userId', req.body.userId)
    console.log('no cookies');
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, ACCESS_SECRET_KEY)
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if ( !decodedToken ) {
    console.log('!decodedToken');
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  console.log('decodedToken._id', decodedToken._id);
  req.userId = decodedToken._id;
  console.log('req.userId',req.userId);
  req.role = decodedToken.role;
  req.status = 200;
  next();
}
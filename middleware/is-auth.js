const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if ( !authHeader ) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY)
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if ( !decodedToken ) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.role = decodedToken.role;
  req.status = 200;
  next();
}
const User = require("../models/user");

module.exports  = (req, res, next) => {
  const id = req.userId;
  const role = req.role;
  if (role !== 'admin') {
    const error = new Error('Not Authorized!');
    error.statusCode = 401;
    throw error;
  }
    User.findById(id)
      .then(foundUser => {
        if (foundUser.role !== role) {
          const error = new Error("Not Authorized. User's role does not match records.");
          error.statusCode = 401;
          throw error;
        }
      })
      .catch(error => {
        next(error);
      })
  next();
}
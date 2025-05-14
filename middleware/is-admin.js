const User = require("../models/user");

module.exports  = (req, res, next) => {
  const id = req.userId;
  console.log('id', id);
  User.findById(id)
    .then(foundUser => {
      if (foundUser?.role !== 'admin') {
        console.log('foundUser', foundUser);
        const error = new Error("Action is forbidden. User is not an admin.");
        error.statusCode = 403;
        throw error;
      }
      next();
    })
    .catch(error => {
      next(error);
    })
}
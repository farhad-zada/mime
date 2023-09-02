
module.exports = function (role) {
    return (req, res, next) => {
      if (req.user && req.user.role.includes(role)) {
        return next();
      }
      return res.status(403).json({ message: 'Access denied.' });
    };
  };
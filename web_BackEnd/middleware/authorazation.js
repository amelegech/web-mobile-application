// Authorize give a permission based on the role 
exports.authorize = (...role) => {
    return (req, res, next) => {
      if (!role.includes(req.farmer.role)) {
        return res.status(400).json({
          success: false,
          data: "farmer role is not authorized to access this route",
        });
      }
      next();
    };
  };
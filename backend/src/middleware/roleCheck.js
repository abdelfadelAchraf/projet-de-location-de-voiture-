import ApiResponse from '../utils/apiResponse.js';

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Please login to access this route');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Please login to access this route');
  }

  if (req.user.role !== 'admin') {
    return ApiResponse.forbidden(res, 'Access denied. Admin privileges required');
  }

  next();
};

// Check if user is manager or admin
exports.isManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Please login to access this route');
  }

  if (!['admin', 'manager'].includes(req.user.role)) {
    return ApiResponse.forbidden(res, 'Access denied. Manager or Admin privileges required');
  }

  next();
};

// Check if user owns the resource or is admin
exports.isOwnerOrAdmin = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${resourceModel}`);
      const resource = await Model.findById(req.params[resourceIdParam]);

      if (!resource) {
        return ApiResponse.notFound(res, `${resourceModel} not found`);
      }

      const isOwner = resource.user && resource.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return ApiResponse.forbidden(res, 'Not authorized to access this resource');
      }

      req.resource = resource;
      next();
    } catch (error) {
      return ApiResponse.error(res, 'Error checking resource ownership');
    }
  };
};

export default exports;
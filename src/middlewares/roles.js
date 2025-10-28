export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
}

export function isMemberOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role === 'admin') {
    // Admins can do anything
    req.isAdmin = true;
    return next();
  }

  // For members, check if they own the resource
  req.isAdmin = false;
  next();
}

export function checkOwnership(resource) {
  return (req, res, next) => {
    if (req.isAdmin) {
      // Admins can access any resource
      return next();
    }

    // Check if resource owner matches current user
    const resourceOwner = resource.owner?.toString();
    const userId = req.user._id.toString();

    if (resourceOwner !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
}


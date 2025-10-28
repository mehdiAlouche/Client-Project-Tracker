import { verifyToken, getUserById } from '#@/modules/auth/index.js';

export async function auth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract token
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await getUserById(decoded.userId);
    
    // Attach user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
}


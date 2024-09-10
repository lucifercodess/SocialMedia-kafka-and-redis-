import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers['social-token'] || req.cookies['social-token'];
    
    if (!token) {
      return res.status(401).json({ code: 0, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ code: 0, error: 'Invalid token' });
    }

    req.user = decoded; 
    console.log('Decoded User:', req.user); 
    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);
    return res.status(500).json({ code: 0, error: 'Internal server error' });
  }
};

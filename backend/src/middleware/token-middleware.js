import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  console.log('🔍 AuthenticateToken middleware called');
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Method:', req.method);
  
  // List of endpoints that should skip authentication
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/register'
  ];
  
  // Check if this is a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.originalUrl === endpoint || req.path === endpoint
  );
  
  // Also check for verify token endpoint (with parameters)
  const isVerifyToken = req.originalUrl.startsWith('/api/auth/verify-reset-token/') || 
                       req.path.startsWith('/api/auth/verify-reset-token/') ||
                       req.originalUrl.includes('/api/auth/verify-reset-token/') ||
                       req.path.includes('/api/auth/verify-reset-token/');
  
  console.log('isPublicEndpoint:', isPublicEndpoint);
  console.log('isVerifyToken:', isVerifyToken);
  
  if (isPublicEndpoint || isVerifyToken) {
    console.log('✅ SKIPPING authentication for:', req.originalUrl);
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.header("Authorization");
  console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
  
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.error('No token provided for path:', req.path);
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  console.log('Token found, verifying...');
  
  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).send("Invalid or expired token.");
    }
    console.log('Token verified successfully, decoded:', decoded);
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  });
}

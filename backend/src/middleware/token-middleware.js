import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  console.log('AuthenticateToken middleware called for path:', req.path);
  
  // Skip token verification for the login route
  if (req.path === "/api/auth/login" || req.path === '/api/register') {
    console.log('Skipping authentication for:', req.path);
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

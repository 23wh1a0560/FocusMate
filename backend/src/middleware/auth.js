const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get the token from the header (Format: Bearer <token>)
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // 2. Verify the token using your secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the user ID to the request so the next function knows who is logged in
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

module.exports = { protect };
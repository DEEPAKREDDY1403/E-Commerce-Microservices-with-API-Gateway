const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Validate token with Auth Service
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/validate-token`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    if (response.data.success) {
      // Attach user info to request
      req.user = response.data.data.user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.response?.data?.message || error.message
    });
  }
};

module.exports = authMiddleware;

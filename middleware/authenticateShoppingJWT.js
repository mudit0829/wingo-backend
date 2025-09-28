const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: 'Unauthorized, user not found' });

    // Allow if user is admin or has shopping site role (optional role check)
    if (user.role === 'admin' || user.role === 'shop') {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden, insufficient permissions' });
    }

  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized, token invalid or expired' });
  }
};

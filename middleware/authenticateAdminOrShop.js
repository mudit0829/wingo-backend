module.exports = function(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token || token !== process.env.SHOPPING_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

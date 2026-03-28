const db = require('../db/index');

module.exports = function requireUser(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = header.slice(7);
  const user = db.prepare('SELECT * FROM users WHERE session_token = ?').get(token);
  if (!user) return res.status(401).json({ error: 'User not found' });
  req.user = user;
  next();
};

const jwt = require('jsonwebtoken');
const { client } = require('../config/db.js');
const config = require('../config/env.js');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Please authenticate' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (!user.rows.length) {
      throw new Error();
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;

// middleware/auth.js

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next(); // הכל טוב, אפשר להמשיך
  } else {
    res.status(401).json({ error: "Authorization required." });
  }
};

module.exports = isAuthenticated;

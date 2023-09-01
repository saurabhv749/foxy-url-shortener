const jwt = require("jsonwebtoken");
const { extractAuth } = require("../utils");
const DB = require("../database");

function authenticateToken(req, res, next) {
  const token = extractAuth(req);

  const username = req.headers["custom-username"];

  if (!token || !username) {
    return res.sendStatus(401);
  }

  const validToken = DB.get("tokens", username);

  if (!validToken || validToken !== token) return res.sendStatus(403);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

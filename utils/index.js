require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const uniqueId = () => uuidv4();

const extractAuth = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};
// Generate an access token
const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.ACCESS_TOKEN_SECRET
  );

  return accessToken;
};

module.exports = {
  uniqueId,
  generateAccessToken,
  extractAuth,
};

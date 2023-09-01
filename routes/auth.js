const express = require("express");
const bcrypt = require("bcrypt");
const { uniqueId, generateAccessToken, extractAuth } = require("../utils");
const DB = require("../database");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

/**
 * PAGES
 */

router.get("/", (req, res) => {
  res.redirect("/spoof/login");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

/**
 * API
 */

router.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end();

  // check existing
  const existing = DB.get("users", username);
  if (existing)
    return res.json({ success: false, message: "Username already taken!" });

  const uid = uniqueId();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const date = new Date().toISOString();

  const newUser = {
    user_id: uid,
    username,
    password: hashedPassword,
    date_created: date,
  };
  // create new user

  DB.set("users", username, newUser);
  DB.set("projects", username, []);
  return res.json({
    success: true,
    message:
      "User created successfully! You can now login using the same credentials.",
  });
});

router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = DB.get("users", username);
  if (!user) return res.json({ success: false, message: "User not found!" });

  // Verify credentials
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (isValidPassword) {
    // Generate an access token
    const accessToken = generateAccessToken(user);
    // validate token
    DB.set("tokens", username, accessToken);
    //
    res.json({
      accessToken,
      success: true,
      message: "Access-Token generated successfully!",
    });
  } else {
    res.json({ success: false, message: "Wrong password!" });
  }
});

router.post("/api/logout", authenticateToken, (req, res) => {
  // invalidate user token
  const userToken = extractAuth(req);
  const { username } = req.user;
  const savedToken = DB.get("tokens", username);
  if (!savedToken) return res.status(400).send();

  if (userToken === savedToken) {
    DB.delete("tokens", username);
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

module.exports = router;

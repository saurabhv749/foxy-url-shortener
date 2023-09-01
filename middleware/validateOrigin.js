const DB = require("../database");
const fs = require("fs");

function validateOrigin(req, res, next) {
  const { project, username, image } = req.body;

  if (!project || !username) {
    fs.rmSync(image.path, { force: true });
    return res.status(400).end();
  }

  const userProjects = DB.get("projects", username);
  if (!userProjects) {
    fs.rmSync(image.path, { force: true });
    return res.status(400).end();
  }
  const userProject = userProjects.find((x) => x.project_id === project);
  if (!userProject) {
    fs.rmSync(image.path, { force: true });

    return res.status(400).end();
  }

  next();
}

module.exports = validateOrigin;

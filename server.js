const express = require("express");
const path = require("path");
const app = express();

const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const redirectRoute = require("./routes/redirect");
const uploadRoute = require("./routes/upload");

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/spoof", authRoute);
app.use("/spoof/dashboard", dashboardRoute);
app.use("/redirect", redirectRoute);
app.use("/upload", uploadRoute);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (!err) console.log(`server started at http://localhost:${port}`);
});

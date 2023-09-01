const EnhancedJsonDB = require("./enhancedDB");

const databases = ["users", "projects", "victims", "tokens"];
const DB = new EnhancedJsonDB(databases);

module.exports = DB;

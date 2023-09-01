const SimpleJsonDB = require("simple-json-db");
const path = require("path");
const fs = require("fs");

class EnhancedJsonDB {
  constructor(dbs) {
    this.databases = {};
    this.createDB(dbs);
  }

  createDB(dbs) {
    const dataPath = path.join(__dirname, "data");

    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }

    dbs.forEach((db) => {
      const filename = path.join(dataPath, db + ".json");
      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, "{}", "utf-8");
      }

      if (!this.databases[db]) {
        this.databases[db] = new SimpleJsonDB(filename);
      }
    });
  }

  get(dbName, key) {
    return this.databases[dbName].get(key);
  }

  set(dbName, key, value) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    this.databases[dbName].set(key, value);
  }

  delete(dbName, key) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    this.databases[dbName].delete(key);
  }

  getAll(dbName) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    return this.databases[dbName].JSON();
  }

  has(dbName, key) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    return this.databases[dbName].has(key);
  }

  keys(dbName) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    return Object.keys(this.databases[dbName].JSON());
  }

  values(dbName) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    return Object.values(this.databases[dbName].JSON());
  }

  clear(dbName) {
    if (!this.databases[dbName]) {
      throw new Error(`Database "${dbName}" does not exist.`);
    }

    const json = {};
    this.databases[dbName].JSON(json);
  }
}

module.exports = EnhancedJsonDB;

const chokidar = require("chokidar");
const { minify } = require("terser");
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src", "scripts");
const publicDir = path.join(__dirname, "..", "public", "js");

// Minify and copy the source file to the destination
async function minifyAndCopyFile(filePath) {
  const inputCode = fs.readFileSync(filePath, "utf8");
  const minifiedCode = (
    await minify(inputCode, {
      keep_classnames: true,
      toplevel: false,
    })
  ).code;
  const destPath = path.join(publicDir, path.basename(filePath));
  console.log("creating: ", destPath);
  fs.writeFileSync(destPath, minifiedCode);
}

// Watch for changes in the source directory
chokidar.watch(srcDir).on("change", (filePath) => {
  console.log(`File changed: ${filePath}`);
  minifyAndCopyFile(filePath)
    .then(() => {
      console.log(`Minified and copied: ${filePath}`);
    })
    .catch((error) => {
      console.error(`Error minifying ${filePath}: ${error}`);
    });
});

console.log("Watching for changes...");

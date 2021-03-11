const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

if (!fs.existsSync("./screenshot")) {
  fs.mkdir("./screenshot", (err) => {
    if (err) throw err;
    console.log("[Screenshot] directory CREATED!\n");
  });
} else {
  //TODO: if the directory exists, clear it.
  //We can actually get rid of everything and leave only the below cuz it'll create an empty directory if it doesn't exist
  //But for practice purpose, I implemented this way.
  console.log("[Screenshot] directory CLEARED\n");
  fsExtra.emptyDirSync("./screenshot");
}

//TODO: Data file management
if (!fs.existsSync("./data.txt")) {
  fs.open(path.join(__dirname, "data.txt"), "w", (err, file) => {
    if (err) throw err.message;
  });
} else {
  fs.unlink("./data.txt", (err) => {
    if (err) throw err;
    console.log("[data.txt] file DELETED\n");
  });
}

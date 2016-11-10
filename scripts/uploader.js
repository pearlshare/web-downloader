require("dotenv").config();
const uploader = require("../lib/uploader");
const path = require("path");

uploader.syncDir(path.resolve(__dirname, "../tmp"), "test").then(console.log).then(function () {
  process.exit();
});

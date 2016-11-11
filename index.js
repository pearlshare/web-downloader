const fs = require("fs-extra");
const path = require("path");

const configFilePath = path.resolve(__dirname, ".env");
if (!fs.existsSync(configFilePath)) {
  process.stdout.write("###### Creating .env file for first startup ########\n");
  fs.writeFileSync(configFilePath, fs.readFileSync(path.resolve(__dirname, ".env_bak")));
}

require("dotenv").config();

require("./lib");

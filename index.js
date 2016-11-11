const fs = require("fs-extra-promise");
const path = require("path");

const configFilePath = path.resolve(__dirname, ".env");
if (process.env.NODE_ENV !== "production" && !fs.existsSync(configFilePath)) {
  process.stdout.write("###### Creating .env file for first startup ########\n");
  fs.writeFileSync(configFilePath, fs.readFileSync(path.resolve(__dirname, ".env_bak")));
}

require("dotenv").config();

require("./lib/server");

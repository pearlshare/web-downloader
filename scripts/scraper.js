
/*
  Script to download a website and it's assets.

  Usage:

      $: node scraper.js https://pearlshare.com pearlshare

  Will download the contents of https://pearlshare.com to ./resources/pearlshare

  To find out options

      $: node scraper.js --help
 */

const path = require("path");
const argv = require("yargs")
  .usage("Usage: $0 <url> <output>")
  .command("url", "url to download")
  .command("output", "directory to save to (inside ./tmp)")
  .help()
  .argv;

// Get the settings
const url = argv._[0];
const out = path.resolve(__dirname, `../tmp/${argv._[1]}`);
const scraper = require("../lib/scraper");

scraper(url, out);
process.exit();


/*
  Script to download a website and it's assets.

  Usage:

      $: node phantom.js https://pearlshare.com pearlshare

  Will download the contents of https://pearlshare.com to ./resources/pearlshare

  To find out options

      $: node phantom.js --help
 */

const phantomjs = require('phantomjs-prebuilt')
const fs = require("fs-extra");
const path = require("path");
const argv = require("yargs")
  .usage("Usage: $0 <url> <output>")
  .command("url", "url to download")
  .command("output", "directory to save to (inside ./tmp)")
  .help()
  .argv;

// Get the settings
const url = argv._[0];
const out = path.join(__dirname, `tmp/${argv._[1]}`);

// Clear a target dir
fs.removeSync(out)

const program = phantomjs.exec(path.join(__dirname, 'phantomjs/browser_script.js'), url, out)
program.stdout.pipe(process.stdout)
program.stderr.pipe(process.stderr)
program.on('exit', code => {
  // do something on end
  console.log("exiting...")
})

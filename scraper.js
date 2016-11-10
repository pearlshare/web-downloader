
/*
  Script to download a website and it's assets.

  Usage:

      $: node scraper.js https://pearlshare.com pearlshare

  Will download the contents of https://pearlshare.com to ./resources/pearlshare

  To find out options

      $: node scraper.js --help
 */

const scraper = require('website-scraper');
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

scraper.scrape({
  urls: [
    url   // Will be saved with default filename 'index.html'
  ],
  directory: out,
  subdirectories: [
    {directory: 'js', extensions: ['.js']},
    {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
    {directory: 'css', extensions: ['.css']},
    {directory: 'fonts', extensions: ['.ttf', '.woff', '.eot']}
  ],
  sources: [
    {selector: 'img', attr: 'src'},
    {selector: 'link[rel="stylesheet"]', attr: 'href'},
    {selector: 'script', attr: 'src'}
  ],
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
    }
  }
}).catch(function(err){
  console.error(err);
});

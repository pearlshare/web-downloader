const fs = require("fs-extra");
const scraper = require('website-scraper');
const path = require("path");

module.exports = function scrapeUrl (url, out) {
  const outdir = path.resolve(__dirname, "../../tmp", out);

  // Clear a target dir
  fs.removeSync(outdir)

  return scraper.scrape({
    urls: [
      url // Will be saved with default filename 'index.html'
    ],
    directory: outdir,
    subdirectories: [
      // {directory: 'js', extensions: ['.js']},
      {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
      {directory: 'css', extensions: ['.css']},
      {directory: 'fonts', extensions: ['.ttf', '.woff', '.eot']}
    ],
    sources: [
      {selector: 'img', attr: 'src'},
      // {selector: 'script', attr: 'src'},
      {selector: 'link[rel="stylesheet"]', attr: 'href'}
    ],
    urlFilter: function (url) {
      return !/.*\.js$/.test(url);
    },
    request: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
      }
    }
  })
  .then(function () {
    return outdir;
  });
};

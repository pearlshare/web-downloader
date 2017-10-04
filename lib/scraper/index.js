const fs = require("fs-extra-promise");
const scraper = require("website-scraper");
const phantomHtml = require("website-scraper-phantom");

module.exports = function scrapeUrl (url, out, opts = {}) {

  const scraperOpts = {
    urls: [
      url // Will be saved with default filename "index.html"
    ],
    directory: out,
    ignoreErrors: false,
    subdirectories: [
      {directory: "js", extensions: [".js"]},
      {directory: "img", extensions: [".jpg", ".png", ".svg"]},
      {directory: "css", extensions: [".css"]},
      {directory: "fonts", extensions: [".ttf", ".woff", ".eot"]}
    ],
    sources: [
      {selector: "img", attr: "src"},
      {selector: "script", attr: "src"},
      {selector: "link[rel=\"stylesheet\"]", attr: "href"}
    ],
    request: {
      timeout: 1000*60*3,
      headers: {
        'referer': opts.referer,
        'cookie': opts.cookie,
        'user-agent': opts.userAgent
      }
    }
  };

  if (opts.usePhantom) {
    scraperOpts.httpResponseHandler = phantomHtml;
  }

  // Clear a target dir
  return fs.removeAsync(out)
  .then(function () {
    return scraper(scraperOpts);
  })
  .then(function () {
    return out;
  });
};

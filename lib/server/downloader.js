const express = require("express");
const scraper = require("../scraper");
const s3 = require("../s3");
const path = require("path");

const tmpdir = path.join(__dirname, "../../tmp");
const router = express.Router();

router.get("/", function (req, res) {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/css/app.css">
      </head>
      <body>
        <div>
          <a target="_blank" href="https://docs.google.com/a/pearlshare.com/document/d/17icoA-WL101Z-ih2engZ7QkK-NnkBkwIxv5aq8E4n9c/edit?usp=sharing" class="ps-demo-documentation">Documentation</a>
          <a href="/">Back to list</a>
        </div>
        <h1>Download new website to demo</h1>
        <form action="/downloader" method="post">
          <div>
            <p>This will create a copy of a webpage ready for editing. </p>
            <h4>Required information</h4>
            <div>
              <label for="out">Name of client</label>
              <input type="text" name="out" id="out"></input>
            </div>
            <div>
              <label for="url">Web page URL to copy</label>
              <input type="text" name="url" id="name"></input>
            </div>
            <br />
            <hr />
          </div>
          <div>
            <h4>Options</h4>
            <div>
              <label for="usePhantom">Download webpage using Phantom Browser?</label>
              <input type="checkbox" name="usePhantom" id="usePhantom"></input>
            </div>
            <div>
              <label for="cookie">Cookie</label>
              <input type="text" name="cookie" id="cookie"></input>
            </div>
            <div>
              <label for="referer">referer</label>
              <input type="text" name="referer" id="referer"></input>
            </div>
            <div>
              <label for="userAgent">user-agent</label>
              <select name="userAgent" id="userAgent">
                <option value="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36">Chrome</option>
                <option value="Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25">iPhone</option>
              </select>
            </div>
            <br />
            <hr />
          </div>
          <div>
            <input type="submit" value="Create demo" />
          </div>
        </form>
      </body>
    </html>
  `);
});

// Upload a website
router.post("/", function (req, res) {
  scraper(req.body.url, path.join(tmpdir, req.body.out), {
    usePhantom: req.body.usePhantom,
    cookie: req.body.cookie,
    userAgent: req.body.userAgent,
    referer: req.body.referer
  }).then(function (outdir) {
    return s3.syncDir(outdir, req.body.out);
  })
  .then(function () {
    res.redirect(`/editor/${req.body.out}/index.html`);
  })
  .catch(function (err) {
    console.log(err);
    res.status(500);
    res.send(JSON.stringify(err));
  });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const scraper = require("./scraper");
const s3 = require("./s3");

process.env.PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

// Show the downloader interface
app.use(express.static("lib/views"));

app.get("/downloader", function (req, res) {
  res.send(`
    <html>
      <body>
        <div>
          <a href="/">Back to list</a>
        </div>
        <h1>Download new website demo</h1>
        <form action="/downloader" method="post">
          <div>
            <label for="out">Name</label>
            <input type="text" name="out" id="out"></input>
          </div>
          <div>
            <label for="url">Url</label>
            <input type="text" name="url" id="name"></input>
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
app.post("/downloader", function (req, res) {
  console.log("req.body", req.body);
  scraper(req.body.url, req.body.out).then(function (outdir) {
    return s3.syncDir(outdir, req.body.out);
  })
  .then(function (s3Url) {
    res.redirect(s3Url);
  });
});

// List the demo sites
app.get("/", function (req, res) {
  s3.listObjects().then(function (data) {
    return data.CommonPrefixes.map(function (item) {
      return item.Prefix;
    });
  }).then(function (items) {
    res.send(`
      <html>
        <body>
          <h1>Demos</h1>
          <ul>
            ${items.map(i => `<li><a href=${s3.publicUrl(i)}>${i}</a></li>`)}
          </ul>
          <div>
            <a href="/downloader">New</a>
          </div>
        </body>
      </html>
    `);
  });
});

// Stub out JS requests
app.use(/.*\.js/, function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.send("");
});

app.use("/demos", express.static("tmp"));

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})

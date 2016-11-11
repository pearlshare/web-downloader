require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const s3 = require("./s3");
const scraper = require("./scraper");

const app = express();
const tmpdir = path.resolve(__dirname, "../../tmp");

app.use(bodyParser.urlencoded({
  extended: false
}));

// Show the downloader interface
app.use(express.static("public"));

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
  scraper(req.body.url, path.join(tmpdir, req.body.out)).then(function (outdir) {
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
            ${items.map(i => `<li><a href=${s3.publicUrl(i)}>${i}</a> - <a href="${path.join("/editor", i, "index.html")}">Edit</a></li>`)}
          </ul>
          <div>
            <a href="/downloader">New</a>
          </div>
        </body>
      </html>
    `);
  });
});

app.get("/editor/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.downloadFile(key, path.join(tmpdir, key))
  .then(function (contents) {
    res.send(`
      <html>
        <body>
          <div>
            <a href="/">Back to list</a>
          </div>
          <h1>Edit site</h1>
          <form action="/editor/${key}" method="post">
            <textarea name="contents" style="width: 100vw; height: 90vh">${contents}</textarea>
            <div>
              <input type="submit" value="Update" />
            </div>
          </form>
        </body>
      </html>
    `);
  });
});

app.post("/editor/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.uploadFile(key, path.join(tmpdir, key), req.body.contents)
  .then(function (remote) {
    res.redirect(remote);
  });
});

// Stub out JS requests
app.use(/.*\.js/, function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.send("");
});

app.use("/demos", express.static("tmp"));

app.listen(process.env.PORT, function () {
  console.log('App listening on port 3000!')
})

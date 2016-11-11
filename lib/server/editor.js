const express = require("express");
const s3 = require("../s3");
const path = require("path");
const cleanHtml = require("html");

const tmpdir = path.resolve(__dirname, "../../../tmp");
const router = express.Router();

router.get("/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.downloadFile(key, path.join(tmpdir, key))
  .then(function (contents) {
    try {
      const html = cleanHtml.prettyPrint(contents.toString());
      res.send(`
        <html>
          <body>
            <div>
              <a href="/">Back to list</a>
            </div>
            <h1>Edit site</h1>
            <form action="/editor/${key}" method="post">
              <textarea name="contents" style="width: 100vw; height: 90vh">${html}</textarea>
              <div>
                <input type="submit" value="Update" />
              </div>
            </form>
          </body>
        </html>
      `);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  });
});

router.post("/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.uploadFile(key, path.join(tmpdir, key), req.body.contents)
  .then(function (remote) {
    res.redirect(remote);
  });
});

module.exports = router;

const express = require("express");
const s3 = require("../s3");
const path = require("path");

const tmpdir = path.resolve(__dirname, "../../../tmp");
const router = express.Router();

router.get("/:prefix/:file", function (req, res) {
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

router.post("/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.uploadFile(key, path.join(tmpdir, key), req.body.contents)
  .then(function (remote) {
    res.redirect(remote);
  });
});

module.exports = router;

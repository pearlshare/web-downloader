const express = require("express");
const s3 = require("../s3");
const path = require("path");
const cleanHtml = require("html");

const tmpdir = path.join(__dirname, "../../tmp");
const router = express.Router();

router.get("/:prefix/:file", function (req, res) {
  const key = `${req.params.prefix}/${req.params.file}`;
  s3.downloadFile(key, path.join(tmpdir, key))
  .then(function (contents) {
    try {
      const html = cleanHtml.prettyPrint(contents.toString());
      res.send(`
        <html>
          <head>
            <link rel="stylesheet" href="/codemirror/codemirror.css">
            <link rel="stylesheet" href="/codemirror/solarized.css">
            <script src="/codemirror/codemirror.js"></script>
            <script src="/codemirror/xml.js"></script>
            <script src="/codemirror/javascript.js"></script>
            <script src="/codemirror/htmlmixed.js"></script>
          </head>
          <body>
            <div>
              <a href="/">Back to list</a>
            </div>
            <h1>Edit site</h1>
            <form action="/editor/${key}" method="post">
              <textarea id="code" name="contents" style="width: 100vw; height: 90vh">${html}</textarea>
              <div>
                <input type="submit" value="Save" />
                &nbsp;
                <input type="submit" name="view" value="Save & Preview" />
              </div>
            </form>
            <script>
              var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                theme: "solarized",
                mode: "htmlmixed",
                htmlMode: true
              });
            </script>
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
    if (req.body.view) {
      res.redirect(remote);
    } else {
      res.redirect(req.originalUrl);
    }
  });
});

module.exports = router;

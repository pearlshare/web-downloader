const fs = require("fs-extra");
const path = require("path");
const s3 = require("s3");

const client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION,
    s3RetryCount: 0,    // this is the default
    s3RetryDelay: 0, // this is the default
  },
});

function publicUrl (prefix) {
  return `http://${process.env.S3_BUCKET}.s3-website-${process.env.S3_REGION}.amazonaws.com/${prefix}`;
}

function syncDir (src, prefix) {
  return new Promise(function (resolve, reject) {
    const uploader = client.uploadDir({
      localDir: src,
      s3Params: {
        Prefix: `${prefix}/`,
        Bucket: process.env.S3_BUCKET
      },
      deleteRemoved: true
    });

    uploader.on("end", function () {
      // remove files
      fs.remove(src, function () {
        // return location to find them
        resolve(publicUrl(prefix));
      });
    });

    uploader.on('progress', function () {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });

    uploader.on("error", reject);
  })
}

function listObjects () {
  return new Promise(function (resolve, reject) {
    const lister = client.listObjects({
      s3Params: {
        Prefix: "",
        Bucket: process.env.S3_BUCKET,
        Delimiter: "/"
      }
    });

    let out;

    lister.on("end", function () {
      resolve(out);
    });

    lister.on("data", function (data) {
      out = data;
    });

    lister.on("error", reject);
  });
}

function downloadFile (remote, local) {
  return new Promise(function (resolve, reject) {
    fs.ensureDir(path.dirname(remote), function () {
      console.log("local", local)
      const downloader = client.downloadFile({
        localFile: local,
        s3Params: {
          Bucket: process.env.S3_BUCKET,
          Key: remote
        }
      });

      downloader.on("end", function () {
        fs.readFile(local, function (err, contents) {
          if (err) {
            reject(err);
          }
          resolve(contents);
        });
      });

      downloader.on("error", reject)
    });
  });
}

function uploadFile (remote, local, contents) {
  return new Promise(function (resolve, reject) {

    fs.outputFile(local, contents, {encoding: "utf8"}, function (err) {
      if (err) {
        reject(err);
      } else {
        const uploader = client.uploadFile({
          localFile: local,
          s3Params: {
            Bucket: process.env.S3_BUCKET,
            Key: remote
          }
        });

        uploader.on("end", function () {
          resolve(publicUrl(remote));
        });

        uploader.on("error", reject)
      }
    });
  });
}

module.exports = {
  publicUrl: publicUrl,
  syncDir: syncDir,
  listObjects: listObjects,
  downloadFile: downloadFile,
  uploadFile: uploadFile
}

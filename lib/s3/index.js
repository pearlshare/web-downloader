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

exports.publicUrl = function publicUrl (prefix) {
  return `http://${process.env.S3_BUCKET}.s3-website-${process.env.S3_REGION}.amazonaws.com/${prefix}`;
}

exports.syncDir = function syncDir (src, prefix) {
  return new Promise(function (resolve, reject) {
    const uploader = client.uploadDir({
      localDir: src,
      s3Params: {
        Prefix: `${prefix}/`,
        Bucket: process.env.S3_BUCKET
      },
      deleteRemoved: true
    });

    uploader.on("end", function (out) {
      resolve(publicUrl(prefix));
    });

    uploader.on('progress', function () {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });

    uploader.on("error", function (err) {
      reject(err);
    });
  })
}

exports.listObjects = function listObjects () {
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

    lister.on("error", function (err) {
      reject(err);
    });
  });
}

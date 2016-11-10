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

exports.syncDir = function syncDir (src, prefix) {
  return new Promise(function (resolve, reject) {
    const uploader = client.uploadDir({
      localDir: src,
      s3Params: {
        Prefix: `${prefix}/`,
        Bucket: process.env.S3_BUCKET
      }
    });

    uploader.on("end", function (out) {
      const publicUrl = `http://${process.env.S3_BUCKET}.s3-website-${process.env.S3_REGION}.amazonaws.com/${prefix}`
      resolve(publicUrl);
    });

    uploader.on('progress', function () {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });

    uploader.on("error", function (err) {
      console.log("err", err)
      reject(err);
    });
  })
}

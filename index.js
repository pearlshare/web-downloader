const casper = require("casperjs");
const fs = require("fs-extra");
const path = require("path");

fs.emptyDir(paht.join(__dirname + "/resources"));

const client = casper.create({
  verbose: true,
  pageSettings: {
    loadImages: true
  }
});


client.start("https://www.pearlshare.com/travel-business", function () {
  this.echo(this.getTitle());
});

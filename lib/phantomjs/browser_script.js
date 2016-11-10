console.log("inside phantom")

const page = require("webpage").create();
const system = require("system");

page.onResourceReceived = function (response) {
  console.log("Received", JSON.stringify(response, undefined, 4))
}

page.open(system.args[1], function (status) {
  console.log("status", status)
  console.log("page loaded", system.args[1])
  phantom.exit();
});

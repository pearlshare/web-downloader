function bootUp () {
  var internalLinks = document.querySelectorAll('a[href*="/"]');

  internalLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      alert("This demonstration page does not support all features of the original.");
    });
  });
}

window.onload = function () {
  bootUp();
};

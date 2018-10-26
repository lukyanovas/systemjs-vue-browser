"use strict";

(function () {

  window.translateSFC = function (source) {
    var script = extract(source, "script");
    var match = script.match(/(name ?:|data ?[:(](.*){|methods ?:|props ?:|computed ?:|components ?:)/im);

    var template = extract(source, "template");
    var result = script.substr(0, match.index) + "template:  `" + template + "`," + script.substr(match.index);

    appendStyle(parseStyle(source));

    return result;
  };

  function parseStyle(text) {
    var style = extract(text, "style");
    if (style) {
      return style.replace(/[\n\r]+/g, "").replace(/ {2,20}/g, " ");
    }
  }

  function extract(text, tag) {
    var start = text.indexOf("<" + tag);
    var startTagLength = findTagEnd(text, start);
    var end = text.indexOf("</" + tag + ">");

    if (start !== -1) {
      return text.substring(startTagLength, end);
    }
  }

  function findTagEnd(text, start) {
    var i = start;
    while (i < text.length && text[i++] !== ">") {}
    return i;
  }

  function appendStyle(css) {
    if (css && typeof document !== "undefined") {
      var style = document.createElement("style");
      style.type = "text/css";
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      var head = document.head || document.querySelector("head") || document.getElementsByTagName("head")[0];

      head.appendChild(style);
    }
  }
})();

if (typeof exports !== 'undefined') {
  exports.translate = function () {
    return function (load) {
      return load.source = translateSFC(load.source);
    };
  }();
}
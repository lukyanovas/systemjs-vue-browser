"use strict";

(function () {

  window.translateSFC = function (source) {
    var script = extract(source, "script").content;
    var match = script.match(/(name ?:|data ?[:(](.*){|methods ?:|props ?:|computed ?:|components ?:)/im);

    var template = extract(source, "template").content;
    var result = script.substr(0, match.index) + "template:  `" + template + "`," + script.substr(match.index);

    appendStyle(parseStyle(source));

    return result;
  };

  function extract(text, tag) {
    var firstTagSymbols = "<" + tag;
    var start = text.indexOf(firstTagSymbols);
    var contentStart = findTagEnd(text, start);
    var contentEnd = text.indexOf("</" + tag + ">");

    return {
      content: start !== -1 ? text.substring(contentStart, contentEnd) : null,
      attrs: text.substring(start + firstTagSymbols.length, contentStart - 1)
    }
  }

  function findTagEnd(text, start) {
    var i = start;
    while (i < text.length && text[i++] !== ">") {}
    return i;
  }

  function parseStyle(text) {
    var styleInfo = extract(text, "style");
    if (styleInfo.content) {
      styleInfo.content = styleInfo.content.replace(/[\n\r]+/g, "").replace(/ {2,20}/g, " ");
    }
    return styleInfo;
  }

  function appendStyle(styleInfo) {
    var css = styleInfo.content;
    var src = findSrc(styleInfo.attrs);
    if ((css || src) && typeof document !== "undefined") {
      var style = document.createElement("style");
      src && style.setAttribute("src", src);
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

  function findSrc(attrs) {
    if (!attrs) return "";
    var result = attrs.match(/src="(.*)"/i);

    return result ? result[1] : "";
  }

})();

if (typeof exports !== 'undefined') {
  exports.translate = function () {
    return function (load) {
      return load.source = translateSFC(load.source);
    };
  }();
}
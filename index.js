exports.translate = (() => {
  return (load) => {
    return (load.source = translate(load.source));
  };
})();

function translate(source) {
  const script = extract(source, "script");
  const match = script.match(
    /(name(.*):|data(.*){|methods(.*):|computed(.*):|components(.*):)/im
  );

  const template = extract(source, "template");
  const result = `${
    script.substr(0, match.index)
  }template:  \`${template}\`,${
    script.substr(match.index)
  }`;

  appendStyle(parseStyle(source));

  return result;
}

function parseStyle(text) {
  const style = extract(text, "style");
  if (style) {
    return style
      .replace(/[\n\r]+/g, "")
      .replace(/ {2,20}/g, " ");
  }
}

function extract(text, tag) {
  const start = text.indexOf(`<${tag}`);
  const startTagLength = findTagEnd(text, start);
  const end = text.indexOf(`</${tag}>`);
  
  if (start !== -1) {
    return text.substring(startTagLength, end);
  }
}

function findTagEnd(text, start) {
  let i = start;
  while (i < text.length && text[i++] !== ">");
  return i;
}

function appendStyle(css) {
  if (css && typeof document !== "undefined") {
    const style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    const head =
      document.head ||
      document.querySelector("head") ||
      document.getElementsByTagName("head")[0];
      
    head.appendChild(style);
  }
}

require("./index.js");

const template = `
<template>
    <div class="my-class">
        Content and { text }
    </div>
</template>
<script>
export default {
  data() {
    return {
      text: "my-text",
    };
  }
};
</script>`;

const componentSource = `${template}
<style>
.my-class {
    color: red;
}
</style>`;

beforeEach(() => {
    document.head.textContent = "";
});


it("process template", () => {
    const result = `
export default {
  template:  \`
    <div class=\"my-class\">
        Content and { text }
    </div>
\`,data() {
    return {
      text: \"my-text\",
    };
  }
};
`;
    expect(translateSFC(componentSource)).toBe(result);
});

it("process template without styles", () => {
    const result = `
export default {
  template:  \`
    <div class=\"my-class\">
        Content and { text }
    </div>
\`,data() {
    return {
      text: \"my-text\",
    };
  }
};
`;
    expect(translateSFC(template)).toBe(result);
});

it("process styles", () => {
    translateSFC(componentSource)
    expect(document.head.children[0].outerHTML).toEqual('<style type="text/css">.my-class { color: red;}</style>');
});

it("process with standalone styles", () => {
    const componentWithStandaloneStyles = `${template}
    <style scoped anothershit src="./styles.css"></style>`;

    translateSFC(componentWithStandaloneStyles)
    expect(document.head.children[0].outerHTML).toEqual('<style src=\"./styles.css\" type=\"text/css\"></style>');
});
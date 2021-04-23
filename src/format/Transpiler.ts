import { TokenValue, Markdown5 } from "./Types";

const converts = (tokens: TokenValue[]): string => {
  const [head, ...tails] = tokens;
  return convert(head) + (tails.length <= 0 ? "" : converts(tails));
};
const convert = (token: TokenValue): string => {
  switch (token.kind) {
    case "markdown5":
      return converts([token.value.title, ...token.value.contents]);
    case "section":
      return `<section>${converts([
        token.value.header,
        ...token.value.contents,
      ])}</section>`;
    case "title":
      return `<h1>${token.value}</h1>`;
    case "sectionHeader":
      return `<h1>${convert(token.value)}</h1>`;
    case "list": {
      const { title, contents } = token.value;
      const lis = contents.map((it) => `<li>${converts(it)}</li>`).join("");
      const ul = `<ul>${lis}</ul>`;
      return title === ""
        ? ul
        : `<section class="list"><h1>${title}</h1>${ul}</section>`;
    }
    case "code": {
      const { title, content } = token.value;
      const encoded = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const code = `<pre><code>${encoded}</code></pre>`;
      return title === ""
        ? code
        : `<section class="code"><h1>${title}</h1>${code}</section>`;
    }
    case "paragraph":
      return `<p>${converts(token.value)}</p>`;
    case "text":
      return token.value;
    case "link":
      return `<a href="${token.value.href}">${token.value.title}</a>`;
    default:
      return "";
  }
};
export const transpile = (source: Markdown5): string => convert(source);

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
    case "sectionHeader":
      return `<h1>${token.value}</h1>`;
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

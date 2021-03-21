import { TokenKind, Token, Markdown5 } from "./Types";

const converts = (tokens: Token[]): string => {
  const [head, ...tails] = tokens;
  return convert(head) + (tails.length <= 0 ? "" : converts(tails));
};
const convert = (token: Token): string => {
  switch (token.kind) {
    case TokenKind.markdown5:
      return converts([token.value.title, ...token.value.contents]);
    case TokenKind.section:
      return `<section>${converts([
        token.value.header,
        ...token.value.contents,
      ])}</section>`;
    case TokenKind.sectionHeader:
      return `<h1>${token.value}</h1>`;
    case TokenKind.paragraph:
      return `<p>${token.value}</p>`;
    default:
      return "";
  }
};
export const transpile = (source: Markdown5): string => convert(source);

import { TokenKind, Token } from "./Types";

const convert = (token: Token) => {
  switch (token.kind) {
    case TokenKind.paragraph:
      return `<p>${token.value}</p>`;
    case TokenKind.section:
      return `<section>${transpile([
        token.value.header,
        ...token.value.contents,
      ])}</section>`;
    case TokenKind.sectionHeader:
      return `<h1>${token.value}</h1>`;
    default:
      return "";
  }
};
export const transpile = (tokens: Token[]): string => {
  const [head, ...tails] = tokens;
  return convert(head) + (tails.length <= 0 ? "" : transpile(tails));
};

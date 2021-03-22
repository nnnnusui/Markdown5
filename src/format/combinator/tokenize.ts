import convert from "../../parser/combinator/convert";
import { Parser } from "../../parser/Types";
import { TokenKind, FindFromUnion, TokenValue, Token } from "../Types";

export const tokenize = <Src, Before, After extends TokenKind>(
  parser: Parser<Before, Src>,
  func: (before: Before) => FindFromUnion<TokenValue, "kind", After>
): Parser<Token<After>, Src> =>
  convert(parser, (it, offset) => Token(func(it), offset));

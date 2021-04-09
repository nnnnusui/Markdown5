import convert from "../../parser/combinator/convert";
import { Combinator } from "../../parser/Types";
import { TokenKind, FindFromUnion, TokenValue, Token } from "../Types";

const tokenize = <Src, Before, After extends TokenKind>(
  combinator: Combinator<Before, Src>,
  func: (before: Before) => FindFromUnion<TokenValue, "kind", After>
): Combinator<Token<After>, Src> =>
  convert(combinator, (it, offset) => Token(func(it), offset));
export default tokenize;

import {
  Parsers,
  Parser,
  Tail,
  TupledParsersResult,
  ParsersSrc,
} from "../Types";
import chain from "./chain";
import convert from "./convert";

const chainR = <T extends Parsers<any>>(
  ...parsers: T
): Parser<Tail<TupledParsersResult<typeof parsers>>, ParsersSrc<T>> =>
  convert(
    chain(...parsers),
    (it) => it.reverse()[0] as Tail<TupledParsersResult<typeof parsers>>
  );
export default chainR;

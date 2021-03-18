import { Parsers, Parser, TupledParsersResult, ParsersSrc } from "../Types";
import chain from "./chain";
import convert from "./convert";

const chainL = <T extends Parsers<any>>(
  ...parsers: T
): Parser<TupledParsersResult<typeof parsers>[0], ParsersSrc<T>> =>
  convert(chain(...parsers), (it) => it[0]);

export default chainL;

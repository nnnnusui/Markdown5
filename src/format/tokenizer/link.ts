import chain from "../../parser/combinator/chain";
import chainL from "../../parser/combinator/chainL";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import any from "../../parser/combinator/minimum/any";
import not from "../../parser/combinator/not";
import repeat from "../../parser/combinator/repeat";
import Char from "../Char";
import sames from "../combinator/sames";
import to from "../combinator/to";
import tokenize from "../combinator/tokenize";
import { macroPrefix } from "../combinator/util";
import Parser from "../Parser";

const arg = <T>(comparator: Parser<T>) =>
  convert(to(comparator, false), (it) => it.join(""));
const suffix = sames("|");

const splitter = " ";
const keyword = "link";

const syntax = chainR(macroPrefix, sames(`${keyword}${splitter}`), arg(suffix));
const link = tokenize(syntax, (_args) => {
  const args = _args.split(splitter);
  const href = args[1] ? args[1] : args[0];
  const title = args[0];
  return { kind: "link", value: { href, title } };
});
export default link;

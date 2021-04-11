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

const arg = (separator: string) =>
  convert(to(sames(separator), false), (it) => it.join(""));
const args = convert(chain(repeat(arg(",")), arg(".")), ([heads, tail]) => [
  ...heads,
  tail,
]);

const syntax = chainR(macroPrefix, sames("link,"), args);
const link = tokenize(syntax, (args) => {
  const href = args[1] ? args[1] : args[0];
  const title = args[0];
  return { kind: "link", value: { href, title } };
});
export default link;

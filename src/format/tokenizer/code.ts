import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import any from "../../parser/combinator/minimum/any";
import repeat from "../../parser/combinator/repeat";
import Char from "../Char";
import sames from "../combinator/sames";
import tokenize from "../combinator/tokenize";
import { indented, line, macroPrefix } from "../combinator/util";
import Parser from "../Parser";
import { Token } from "../Types";

const all = convert(repeat(any<Char>()), (it) => it.join(""));
const title = line;

const syntax = chainR(macroPrefix, sames("code"), chain(title, indented(all)));
const code: Parser<Token<"code">> = tokenize(syntax, ([title, content]) => ({
  kind: "code",
  value: { title, content },
}));
export default code;

import chainR from "../../parser/combinator/chainR";
import sames from "../combinator/sames";
import to from "../combinator/to";
import tokenize from "../combinator/tokenize";
import { macroPrefix } from "../combinator/util";

const suffix = sames("|");

const splitter = " ";
const keyword = "link";

const syntax = chainR(
  macroPrefix,
  sames(`${keyword}${splitter}`),
  to(suffix, false)
);
const link = tokenize(syntax, (_args) => {
  const args = _args.split(splitter);
  const href = args[1] ? args[1] : args[0];
  const title = args[0];
  return { kind: "link", value: { href, title } };
});
export default link;

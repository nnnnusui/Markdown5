import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import lazy from "../../parser/combinator/lazy";
import option from "../../parser/combinator/option";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import sames from "../combinator/sames";
import tokenize from "../combinator/tokenize";
import { indented, line, macroPrefix } from "../combinator/util";
import Parser from "../Parser";
import { Token } from "../Types";
import content from "./content";
import section from "./section";

const childContents = indented(lazy(() => repeat(content)));
const simpleText = convert(
  tokenize(
    tokenize(line, (it) => ({ kind: "text", value: it })),
    (it) => ({ kind: "paragraph", value: [it] })
  ),
  (it) => [it]
);
const li = or(
  lazy(() => convert(or(list, section), (it) => [it])),
  convert(chain(simpleText, option(childContents)), ([head, tails]) => [
    ...(head ? head : []),
    ...(tails ? tails : []),
  ])
);
const title = line;
const syntax = chainR(
  macroPrefix,
  sames("list"),
  chain(title, indented(repeat(li)))
);
const list: Parser<Token<"list">> = tokenize(syntax, ([title, contents]) => ({
  kind: "list",
  value: { title, contents },
}));
export default list;

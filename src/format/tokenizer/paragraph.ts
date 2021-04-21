import chain from "../../parser/combinator/chain";
import chainL from "../../parser/combinator/chainL";
import chainR from "../../parser/combinator/chainR";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import sames from "../combinator/sames";
import tokenize from "../combinator/tokenize";
import {
  indentChar,
  sectionHeaderPrefix,
  emptyLine,
  line,
  eol,
} from "../combinator/util";
import Parser from "../Parser";
import { Token } from "../Types";
import block from "./block";
import link from "./link";

const paragraphIndent = chainR(or(indentChar, sames("　")), not(indentChar));
const nots = not(or(paragraphIndent, block, sectionHeaderPrefix, emptyLine));

const text = tokenize(line, (it) => ({
  kind: "text",
  value: it,
}));

const span = chainL(or(chainL(link, option(eol)), text));
const oneLine = chainR(nots, span);
const head = chainR(option(paragraphIndent), oneLine);
const tails = repeat(oneLine);
const syntax = chain(head, tails);

const paragraph: Parser<Token<"paragraph">> = tokenize(
  syntax,
  ([head, tails]) => ({
    kind: "paragraph",
    value: [head, ...tails.flat()],
  })
);
export default paragraph;

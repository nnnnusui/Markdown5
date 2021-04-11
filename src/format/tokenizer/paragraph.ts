import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import sames from "../combinator/sames";
import tokenize from "../combinator/tokenize";
import {
  indentChar,
  indent,
  sectionHeaderPrefix,
  emptyLine,
  line,
} from "../combinator/util";
import Parser from "../Parser";
import { Token } from "../Types";

const paragraphIndent = chainR(or(indentChar, sames("　")), not(indentChar));
const startOtherBlock = chain(indent, sectionHeaderPrefix);
const nots = not(or(paragraphIndent, startOtherBlock, emptyLine));
const oneLine = chainR(nots, line);
const head = chainR(option(paragraphIndent), oneLine);
const tails = (indent: string) => repeat(chainR(sames(indent), oneLine));
const syntax = (indent: string) => chain(head, tails(indent));

const paragraph = (blockIndent: string): Parser<Token<"paragraph">> => {
  return tokenize(syntax(blockIndent), ([head, tails]) => ({
    kind: "paragraph",
    value: [head, ...tails].join(""),
  }));
};
export default paragraph;

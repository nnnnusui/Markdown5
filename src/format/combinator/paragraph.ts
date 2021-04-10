import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import Parser from "../Parser";
import { Token } from "../Types";
import sames from "./sames";
import tokenize from "./tokenize";
import {
  indentChar,
  indent,
  sectionHeaderPrefix,
  emptyLine,
  line,
} from "./util";

const paragraph = (blockIndent: string): Parser<Token<"paragraph">> => {
  const paragraphIndent = chainR(or(indentChar, sames("　")), not(indentChar));
  const startOtherBlock = chain(indent, sectionHeaderPrefix);
  const nots = not(or(paragraphIndent, startOtherBlock, emptyLine));
  const oneLine = chainR(nots, line);
  const head = chainR(option(paragraphIndent), oneLine);
  const tails = repeat(chainR(sames(blockIndent), oneLine));
  const syntax = chain(head, tails);
  return tokenize(syntax, ([head, tails]) => ({
    kind: "paragraph",
    value: [head, ...tails].join(""),
  }));
};
export default paragraph;

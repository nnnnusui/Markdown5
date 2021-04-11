import chainR from "../../parser/combinator/chainR";
import or from "../../parser/combinator/or";
import Parser from "../Parser";
import { Content, Token } from "../Types";
import paragraph from "./paragraph";
import sames from "../combinator/sames";
import section from "./section";
import { indent } from "../combinator/util";
import Result from "../../type/Result";

const block: Parser<Token<"section">> = (src) => {
  const blockIndent = indent(src);
  if (!blockIndent.ok) return blockIndent;
  const { head, tail } = blockIndent.get;
  if (head === "") return Result.err(src);
  return section(head)(tail);
};

const content = (indent: string): Parser<Content> =>
  chainR(sames(indent), or(block, paragraph(indent)));

export default content;

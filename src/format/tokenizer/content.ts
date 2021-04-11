import chainR from "../../parser/combinator/chainR";
import or from "../../parser/combinator/or";
import { err } from "../../parser/Types";
import Parser from "../Parser";
import { Content, Token } from "../Types";
import paragraph from "./paragraph";
import sames from "../combinator/sames";
import section from "./section";
import { indent } from "../combinator/util";

const block: Parser<Token<"section">> = (src) => {
  const blockIndent = indent(src);
  if (!blockIndent.ok) return blockIndent;
  const { head, tail } = blockIndent.get;
  if (head === "") return err(src);
  return section(head)(tail);
};

const content = (indent: string): Parser<Content> =>
  chainR(sames(indent), or(block, paragraph(indent)));

export default content;

import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import option from "../../parser/combinator/option";
import Parser from "../Parser";
import { Token } from "../Types";
import tokenize from "../combinator/tokenize";
import { sectionHeaderPrefix, line } from "../combinator/util";
import repeat from "../../parser/combinator/repeat";
import content from "./content";
import span from "./span";

const header = tokenize(chainR(sectionHeaderPrefix, span), (line) => ({
  kind: "sectionHeader",
  value: line,
}));
const syntax = chain(header, option(repeat(content)));

const section: Parser<Token<"section">> = tokenize(
  syntax,
  ([header, contents]) => ({
    kind: "section",
    value: { header, contents: contents ? contents : [] },
  })
);
export default section;

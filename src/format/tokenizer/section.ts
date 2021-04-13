import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import option from "../../parser/combinator/option";
import Parser from "../Parser";
import { Token } from "../Types";
import contents from "./contents";
import tokenize from "../combinator/tokenize";
import { sectionHeaderPrefix, line } from "../combinator/util";

const header = tokenize(chainR(sectionHeaderPrefix, line), (line) => ({
  kind: "sectionHeader",
  value: line,
}));
const syntax = chain(header, option(contents));

const section: Parser<Token<"section">> = tokenize(
  syntax,
  ([header, contents]) => ({
    kind: "section",
    value: { header, contents: contents ? contents : [] },
  })
);
export default section;

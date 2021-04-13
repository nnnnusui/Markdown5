import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import Parser from "../Parser";
import { Token } from "../Types";
import contents from "./contents";
import sames from "../combinator/sames";
import tokenize from "../combinator/tokenize";
import { sectionHeaderPrefix, line } from "../combinator/util";
import lazy from "../../parser/combinator/lazy";

const header = tokenize(chainR(sectionHeaderPrefix, line), (line) => ({
  kind: "sectionHeader",
  value: line,
}));
const syntax = (indent: string) =>
  chain(
    header,
    option(
      chainR(
        not(chain(sames(indent), sectionHeaderPrefix)),
        lazy(() => contents(indent))
      )
    )
  );

const section = (indent: string): Parser<Token<"section">> => {
  return tokenize(syntax(indent), ([header, contents]) => ({
    kind: "section",
    value: { header, contents: contents ? contents : [] },
  }));
};
export default section;

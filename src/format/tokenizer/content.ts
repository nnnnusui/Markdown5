import chainR from "../../parser/combinator/chainR";
import lazy from "../../parser/combinator/lazy";
import or from "../../parser/combinator/or";
import { emptyLines, indented } from "../combinator/util";
import Parser from "../Parser";
import { Content } from "../Types";
import list from "./list";
import paragraph from "./paragraph";
import section from "./section";

const content: Parser<Content> = chainR(
  emptyLines,
  or(indented(lazy(() => section)), list, paragraph)
);

export default content;

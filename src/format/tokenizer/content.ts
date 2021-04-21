import chainR from "../../parser/combinator/chainR";
import or from "../../parser/combinator/or";
import { emptyLines } from "../combinator/util";
import Parser from "../Parser";
import { Content } from "../Types";
import block from "./block";
import paragraph from "./paragraph";

const content: Parser<Content> = chainR(emptyLines, or(block, paragraph));

export default content;

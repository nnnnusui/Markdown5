import chainR from "../../parser/combinator/chainR";
import repeat from "../../parser/combinator/repeat";
import Parser from "../Parser";
import { Content } from "../Types";
import content from "./content";
import { emptyLines } from "../combinator/util";

const contents = (indent: string): Parser<Content[]> =>
  repeat(chainR(emptyLines, content(indent)));
export default contents;

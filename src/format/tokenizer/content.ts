import chainR from "../../parser/combinator/chainR";
import or from "../../parser/combinator/or";
import Parser from "../Parser";
import chain from "../../parser/combinator/chain";
import convert from "../../parser/combinator/convert";
import repeat from "../../parser/combinator/repeat";
import Char from "../Char";
import higher from "../../parser/combinator/higher";
import sames from "../combinator/sames";
import { line, indent } from "../combinator/util";
import { Content } from "../Types";
import paragraph from "./paragraph";
import lazy from "../../parser/combinator/lazy";
import use from "../../parser/combinator/use";
import section from "./section";

const indentBlock = (indent: string): Parser<Char[]> =>
  convert(chain(line, repeat(chainR(sames(indent), line))), ([head, tails]) =>
    [head, ...tails].join("\n").chars()
  );

const indented = <T>(parser: Parser<T>): Parser<T> =>
  use(indent, (it) => (it === "" ? null : higher(indentBlock(it), parser)));

const content: Parser<Content> = or(indented(lazy(() => section)), paragraph);

export default content;

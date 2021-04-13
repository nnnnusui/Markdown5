import chain from "../../parser/combinator/chain";
import chainL from "../../parser/combinator/chainL";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import higher from "../../parser/combinator/higher";
import not from "../../parser/combinator/not";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import use from "../../parser/combinator/use";
import Char from "../Char";
import Parser from "../Parser";
import sames from "./sames";
import to from "./to";

export const eol = sames("\n");
export const tab = sames("\t");
export const space = sames(" ");
export const indentChar = or(tab, space);
export const emptyLine = convert(chainL(repeat(indentChar), eol), (it) =>
  it.join("")
);
export const emptyLines = repeat(emptyLine);
export const line = to(eol);

export const sectionHeaderPrefix = sames("# ");
export const macroPrefix = sames("@");

export const indent = convert(repeat(indentChar), (it) => it.join(""));

const indentBlock = (indent: string): Parser<Char[]> =>
  convert(
    chain(
      line,
      repeat(
        or(
          emptyLine,
          chainR(sames(indent), chainR(not(sectionHeaderPrefix), line))
        )
      )
    ),
    ([head, tails]) => [head, ...tails].join("\n").chars()
  );

export const indented = <T>(parser: Parser<T>): Parser<T> =>
  use(indent, (it) => (it === "" ? null : higher(indentBlock(it), parser)));

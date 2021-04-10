import chainL from "../../parser/combinator/chainL";
import convert from "../../parser/combinator/convert";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import sames from "./sames";
import to from "./to";

export const eol = sames("\n");
export const tab = sames("\t");
export const space = sames(" ");
export const indentChar = or(tab, space);
export const emptyLine = chainL(repeat(indentChar), eol);
export const emptyLines = repeat(emptyLine);
export const line = convert(to(eol), (it) => it.join(""));

export const sectionHeaderPrefix = sames("# ");

export const indent = convert(repeat(indentChar), (it) => it.join(""));

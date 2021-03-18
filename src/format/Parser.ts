import any from "../parser/combinator/minimum/any";
import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import same from "../parser/combinator/minimum/same";
import { Parser } from "../parser/Types";
import { Content, Indent, Line, Section, Token, TokenKind } from "./Types";
import option from "../parser/combinator/option";

type Char = string & { length: 1 };
declare global {
  interface String {
    char(): Char;
    chars(): Char[];
  }
}
String.prototype[`char`] = function () {
  return this.charAt(0) as Char;
};
String.prototype[`chars`] = function () {
  return this.split("") as Char[];
};

const t = Token;
type Src = Char;
const to = <T, Src>(parser: Parser<T, Src>): Parser<Src[], Src> => {
  const content = repeat(chainR(not(parser), any<Src>()));
  return convert(chain(content, option(parser)), ([content]) => content);
};
const sames = (it: string) => {
  const sames = it
    .chars()
    .reduce((sum, it) => [...sum, same(it)], [] as Parser<Char, Char>[]);
  return convert(chain(...sames), (it) => it.join(""));
};

const eol = sames("\n");
const indentChar = or(sames(" "), sames("\t"));

const indent: Parser<Indent, Src> = convert(repeat(indentChar), (it) =>
  t.indent(it.join(""))
);
const line: Parser<Line, Src> = convert(to(eol), (it) => t.line(it.join("")));
const section: Parser<Section, Src> = (src: Src[]) => {
  const { ok, head: blockIndent, tails } = indent(src);
  const header = (() => {
    const syntax = chain(sames("# "), to(eol));
    return convert(syntax, ([, line]) => t.sectionHeader(line.join("")));
  })();
  const syntax = chain(header, contents(blockIndent));
  const result = convert(syntax, ([header, contents]) =>
    t.section(header, contents)
  )(tails);
  return { ...result, ok: result.ok && ok };
};

const content = (indent: Indent): Parser<Content, Src> => {
  const syntax = chain(sames(indent[1]), or(section, line));
  return convert(syntax, ([, content]) => content);
};
const contents = (indent: Indent = [TokenKind.indent, ""]) =>
  repeat(content(indent));

export const parse = (src: string) => contents()(src.chars());

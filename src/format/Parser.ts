import { convert, repeat, not, chain, same, or } from "../parser/Combinators";
import { Parser } from "../parser/Types";
import { Content, Indent, Section, Token, TokenKind } from "./Types";

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
const to = <T, Src>(parser: Parser<T, Src>): Parser<Src[], Src> => {
  const content = repeat(not(parser));
  const hasTail = convert(chain(content, parser), ([content]) => content);
  return or(hasTail, content);
};
const sames = (it: string) => {
  const sames = it
    .chars()
    .reduce((sum, it) => [...sum, same(it)], [] as Parser<Char, Char>[]);
  return convert(chain(...sames), (it) => it.join(""));
};

type Src = Char;
const eol = sames("\n");
const indentChar = or(sames(" "), sames("\t"));
const indent = convert(repeat(indentChar), (it) => t.indent(it.join("")));
const line = convert(to(eol), (it) => t.line(it.join("")));
const section = (src: Src[]) => {
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

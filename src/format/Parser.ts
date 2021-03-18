import any from "../parser/combinator/minimum/any";
import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import same from "../parser/combinator/minimum/same";
import { Parser } from "../parser/Types";
import { Content, Indent, Paragraph, Section, Token, TokenKind } from "./Types";
import option from "../parser/combinator/option";
import chainL from "../parser/combinator/chainL";

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
const line = convert(to(eol), (it) => it.join(""));
const sectionHeaderPrefix = sames("# ");

const indent: Parser<Indent, Src> = convert(repeat(indentChar), (it) =>
  t.indent(it.join(""))
);
const paragraph = (blockIndent: Indent): Parser<Paragraph, Src> => {
  const nots = not(chain(indent, sectionHeaderPrefix));
  const oneLine = chainR(nots, line);
  const tails = repeat(chainR(sames(blockIndent[1]), oneLine));
  const syntax = chain(oneLine, tails);
  return convert(syntax, ([head, tails]) =>
    t.paragraph([head, ...tails].join(""))
  );
};
const section: Parser<Section, Src> = (src: Src[]) => {
  const { ok, head: blockIndent, tails } = indent(src);
  const header = (() => {
    const syntax = chain(sectionHeaderPrefix, line);
    return convert(syntax, ([, line]) => t.sectionHeader(line));
  })();
  const syntax = chain(header, contents(blockIndent));
  const result = convert(syntax, ([header, contents]) =>
    t.section(header, contents)
  )(tails);
  return { ...result, ok: result.ok && ok };
};

const content = (indent: Indent): Parser<Content, Src> => {
  const syntax = chain(sames(indent[1]), or(section, paragraph(indent)));
  return convert(syntax, ([, content]) => content);
};
const contents = (indent: Indent = [TokenKind.indent, ""]) =>
  repeat(content(indent));

export const parse = (src: string) => contents()(src.chars());

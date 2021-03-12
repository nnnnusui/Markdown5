import {
  convert,
  repeat,
  not,
  chain,
  or,
  same,
  parser,
  any,
  ParseResult,
} from "../parser/Combinators";
import { Parser } from "../parser/Types";
import {
  Content,
  Indent,
  Line,
  Section,
  SectionHeader,
  Token,
  TokenKind,
} from "./Types";

const t = Token;

const eol /* end of line */ = "\n";
const space = same(" ");
const tab = same("\t");

const indentChar = or(space, tab);
const empties = convert(repeat(indentChar), (it) => it.join(""));
const emptyLine = chain(empties, same(eol));

const to = (keyword: string): Parser<string> => {
  const content = convert(repeat(not(keyword)), (it) => it.join(""));
  const hasKeyword = convert(
    chain(content, same(keyword)),
    ([content]) => content
  );
  return or(hasKeyword, content);
};

const indent: Parser<Indent> = convert(repeat(indentChar), (it) =>
  t.indent(it.join(""))
);
const line: Parser<Line> = convert(to(eol), (text) => t.line(text));
const section: Parser<Section> = (src) => {
  const mayBeIndent = indent(src);
  const [blockIndent, tail] = mayBeIndent.ok
    ? mayBeIndent[0]
    : [t.indent(""), src];
  const header = parser<SectionHeader>((src) => {
    const syntax = chain(same("# "), to(eol));
    const conversion = convert(syntax, ([, text]) => t.sectionHeader(text));
    return conversion(src);
  });
  const syntax = chain(header, contents(blockIndent));
  const conversion = convert(syntax, ([header, contents]) =>
    t.section(header, contents)
  );
  return conversion(tail);
};

const content = or(section, line);
const indentedContent = (indent: Indent) =>
  parser<Content>((src) => {
    const syntax = chain(same(indent[1]), content);
    const conversion = convert(syntax, ([, content]) => content);
    return conversion(src);
  });
const contents = (indent: Indent = t.indent("")) =>
  repeat(indentedContent(indent));

export const parse = repeat(content);

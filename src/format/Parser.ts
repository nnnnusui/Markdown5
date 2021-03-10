import { stringify } from "querystring";
import Option from "../type/Option";
import Result from "../type/Result";
import { ok } from "assert";

const enum TokenKind {
  Indent,
  Section,
  Header,
  Text,
}
type Indent = {
  kind: TokenKind.Indent;
  value: string;
};
type Text = {
  kind: TokenKind.Text;
  value: string;
};
type Header = {
  kind: TokenKind.Header;
  text: string;
};
type Section = {
  kind: TokenKind.Section;
  header: Header;
  child: Content[];
};
type Content = Section | Text;

type ParseResult = Result<[any, string], any>;
type Parser = (src: string) => ParseResult;
const r = Result<any, any>();

const slice = (src: string, length: number) => {
  const head = src.slice(0, length);
  const tail = src.slice(length);
  return [head, tail] as const;
};
const any: Parser = (src: string) => r.ok(slice(src, 1));
const match = (it: string): Parser => (src) => {
  const sliced = slice(src, it.length);
  if (it === sliced[0]) return r.ok(sliced);
  return r.err(`error on match: [${sliced[0]}] should be [${it}]`);
};
const not = (it: string): Parser => (src) => {
  const sliced = slice(src, it.length);
  if (it !== sliced[0]) return r.ok(sliced);
  return r.err(`error on not:[${sliced[0]}] should not be [${it}]`);
};

const chain = (parsers: Parser[]): Parser => (src) => {
  const recursion = (
    parsers: Parser[],
    before: ParseResult,
    result: string
  ): ParseResult => {
    const [head, tails] = before.get;
    if (parsers.length <= 0) return r.ok([`${result}${head}`, tails]);
    const [current, ...nexts] = parsers;
    const after = current(tails);
    if (!after.ok) return after;
    return recursion(nexts, after, result + head);
  };
  const [head, ...tails] = parsers;
  const first = head(src);
  if (!first.ok) return first;
  return recursion(tails, first, "");
};

const repeat = (parser: Parser): Parser => (src) => {
  const recursion = (before: ParseResult, result: string): ParseResult => {
    const [head, tails] = before.get;
    const after = parser(tails);
    if (!after.ok || tails === "") return r.ok([`${result}${head}`, tails]);
    return recursion(after, result + head);
  };
  const before = parser(src);
  if (!before.ok) return r.ok(["", src]);
  return recursion(before, "");
};

const parse = (text: string) => {
  const header = chain([match("# "), repeat(not("\n"))]);
  return header(text);
};
export { parse };

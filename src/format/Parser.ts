import Result from "../type/Result";

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

type ParseResult<T> = Result<[T, string], any>;
type Parser<T> = (src: string) => ParseResult<T>;
const r = Result<any, any>();

const slice = (src: string, length: number) => {
  const head = src.slice(0, length);
  const tail = src.slice(length);
  return [head, tail] as const;
};
const any: Parser<string> = (src: string) => r.ok(slice(src, 1));
const match = (it: string): Parser<string> => (src) => {
  const sliced = slice(src, it.length);
  if (it === sliced[0]) return r.ok(sliced);
  return r.err(`error on match: [${sliced[0]}] should be [${it}]`);
};
const not = (it: string): Parser<string> => (src) => {
  const sliced = slice(src, it.length);
  if (it !== sliced[0]) return r.ok(sliced);
  return r.err(`error on not:[${sliced[0]}] should not be [${it}]`);
};

const chain = <T>(parsers: Parser<T>[]): Parser<T[]> => (src) => {
  const recursion = (
    parsers: Parser<T>[],
    before: ParseResult<T>,
    result: T[]
  ): ParseResult<T[]> => {
    const [head, tails] = before.get;
    if (parsers.length <= 0) return r.ok([[...result, head], tails]);
    const [current, ...nexts] = parsers;
    const after = current(tails);
    if (!after.ok) return r.err(after[0]);
    return recursion(nexts, after, [...result, head]);
  };
  const [head, ...tails] = parsers;
  const first = head(src);
  if (!first.ok) return r.err(first[0]);
  return recursion(tails, first, []);
};
const or = <T>(parsers: Parser<T>[]): Parser<T> => (src) => {
  const recursion = (parsers: Parser<T>[]): ParseResult<T> => {
    if (parsers.length <= 0)
      return r.err(`error on or: not match [${parsers}]`);
    const [current, ...nexts] = parsers;
    const result = current(src);
    if (result.ok) return result;
    return recursion(nexts);
  };
  return recursion(parsers);
};

const repeat = <T>(parser: Parser<T>): Parser<T[]> => (src) => {
  const recursion = (
    before: ParseResult<T>,
    results: T[]
  ): ParseResult<T[]> => {
    const [head, tails] = before.get;
    const after = parser(tails);
    if (!after.ok || tails === "") return r.ok([[...results, head], tails]);
    return recursion(after, [...results, head]);
  };
  const before = parser(src);
  if (!before.ok) return r.ok([[], src]);
  return recursion(before, []);
};

const convert = <A, B>(parser: Parser<A>, func: (a: A) => B): Parser<B> => (
  src
) => {
  const parsed = parser(src);
  const result = parsed.getOrNull;
  if (result) {
    const [head, tail] = result;
    return r.ok([func(head), tail]);
  }
  return r.err(parsed.get);
};

const parse = (text: string) => {
  const to = (keyword: string) => {
    const content = convert(repeat(not(keyword)), (it) => it.join(""));
    const hasKeyword = convert(chain([content, match(keyword)]), (it) =>
      it.join("")
    );
    return or([hasKeyword, content]);
  };

  const eol /* end of line */ = "\n";
  const indent = or([match(" "), match("\t")]);
  const indents = convert(repeat(indent), (it) => it.join(""));

  const header = convert(chain([match("# "), to(eol)]), ([, text]) => text);
  const section: Parser<string> = (src) => {
    const firstLine = chain([indents, header])(src);
    const firstLineResult = firstLine.getOrNull;
    if (!firstLineResult) return r.err("error on section: header no found.");
    const [[indent, headerText], tail] = firstLineResult;
    const line = convert( // TODO: 入れ子対応
      chain([match(indent), not("  "), to(eol)]),
      ([, notIndent, line]) => notIndent + line
    );
    const lines = convert(
      repeat(line),
      (it) => `${headerText}${it.join("")}`
    )(tail);
    return lines;
  };
  const content = or([section, to(eol)]);
  const contents = repeat(content);
  return contents(text);
};
export { parse };

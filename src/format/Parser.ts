import Result from "../type/Result";

type ParseResult<T> = Result<[T, string], any>;
type Parser<T> = (src: string) => ParseResult<T>;

type TypeFromParser<P> = P extends Parser<infer T> ? T : never;
type UnionTypeFromParsers<P> = P extends Parser<any>[]
  ? TypeFromParser<P[number]>
  : never;
type UnionParser<T extends Parser<any>[]> = Parser<UnionTypeFromParsers<T>>;

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

const or = <Parsers extends Parser<any>[]>(
  parsers: Parsers
): UnionParser<Parsers> => (src) => {
  const recursion = (index: number): ReturnType<UnionParser<Parsers>> => {
    if (parsers.length <= index)
      return r.err(`error on or: not match [${parsers}]`);
    const current = parsers[index];
    const result = current(src);
    if (result.ok) return result;
    return recursion(index + 1);
  };
  return recursion(0);
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
  const to = (keyword: string): Parser<string> => {
    const content = convert(repeat(not(keyword)), (it) => it.join(""));
    const hasKeyword = convert(
      chain([content, match(keyword)]),
      ([content]) => content
    );
    return or([hasKeyword, content]);
  };

  const eol /* end of line */ = "\n";
  const indentChar = or([match(" "), match("\t")]);

  const enum TokenKind {
    indent,
    line,
    section,
    sectionHeader,
  }
  type Indent = readonly [TokenKind.indent, string];
  type Line = readonly [TokenKind.line, string];
  type SectionHeader = readonly [TokenKind.sectionHeader, string];
  type Section = readonly [
    TokenKind.section,
    { header: SectionHeader; contents: Content[] }
  ];
  type Content = Section | Line;

  const indent: Parser<Indent> = convert(
    repeat(indentChar),
    (it) => [TokenKind.indent, it.join("")] as const
  );
  const line: Parser<Line> = convert(
    to(eol),
    (it) => [TokenKind.line, it] as const
  );

  const header: Parser<SectionHeader> = convert(
    chain([match("# "), to(eol)]),
    ([, text]) => [TokenKind.sectionHeader, text] as const
  );
  // const section: Parser<Section> = (src) => {
  //   const a = [indent, header];

  //   const firstLine = chain([indent, header])(src);
  //   const firstLineResult = firstLine.getOrNull;
  //   if (!firstLineResult) return r.err("error on section: header no found.");
  //   const [[indentText, headerText], tail] = firstLineResult;
  //   const contentsResult = contents(tail).getOrNull;
  //   if (!contentsResult) return r.err("error on section: contents not found.");
  //   const [content, t] = contentsResult;
  //   return r.ok([
  //     [TokenKind.section, { header: headerText, contents: content }],
  //     t,
  //   ]);
  // };
  const content = or([header, line]);
  const contents = repeat(content);
  return contents(text);
};
export { parse };

import Result from "../type/Result";

type ParseResult<T> = Result<[T, string], any>;
type Parser<T> = (src: string) => ParseResult<T>;

type TypeFromParser<P> = P extends Parser<infer T> ? T : never;
type UnionTypeFromParsers<T extends readonly Parser<any>[]> = TypeFromParser<
  T[number]
>;
type UnionParser<T extends readonly Parser<any>[]> = Parser<
  TypeFromParser<T[number]>
>;

type TupleFromParser<P extends readonly Parser<any>[]> = {
  [Key in keyof P]: TypeFromParser<P[Key]>;
};
type TupledParser<T extends readonly Parser<any>[]> = Parser<
  TupleFromParser<T>
>;

const slice = (src: string, length: number) => {
  const head = src.slice(0, length);
  const tail = src.slice(length);
  return [head, tail] as const;
};

const r = Result<any, any>();
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

const chain = <Parsers extends readonly Parser<any>[]>(
  parsers: Parsers
): TupledParser<Parsers> => (src) => {
  const recursion = (
    index: number,
    src: string,
    results: UnionTypeFromParsers<Parsers>[]
  ): ReturnType<TupledParser<Parsers>> => {
    if (parsers.length <= index) return r.ok([results, src]);
    return parsers[index](src).use(
      ([head, tail]) => recursion(index + 1, tail, [...results, head]),
      (it) => r.err(it)
    );
  };
  return recursion(0, src, []);
};

const or = <Parsers extends Parser<any>[]>(
  parsers: Parsers
): UnionParser<Parsers> => (src) => {
  const recursion = (index: number): ReturnType<UnionParser<Parsers>> => {
    if (parsers.length <= index)
      return r.err(`error on or: not match [${parsers}]`);
    return parsers[index](src).use(
      (it) => r.ok(it),
      () => recursion(index + 1)
    );
  };
  return recursion(0);
};

const repeat = <T>(parser: Parser<T>): Parser<T[]> => (src) => {
  const recursion = (
    before: ParseResult<T>,
    results: T[]
  ): ParseResult<T[]> => {
    const [head, tails] = before.get;
    const next = [...results, head];
    if (tails === "") return r.ok([next, tails]);
    const after = parser(tails);
    return after.use(
      () => recursion(after, next),
      () => r.ok([next, tails])
    );
  };
  const before = parser(src);
  return before.use(
    () => recursion(before, []),
    () => r.ok([[], src])
  );
};

const convert = <Before, After>(
  parser: Parser<Before>,
  func: (before: Before) => After
): Parser<After> => (src) =>
  parser(src).use(
    ([result, tail]) => r.ok([func(result), tail]),
    (it) => r.err(it)
  );

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
  const empties = convert(repeat(indentChar), (it) => it.join(""));
  const emptyLine = chain([empties, match(eol)]);

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

  const section: Parser<Section> = (src) => {
    const header: Parser<SectionHeader> = convert(
      chain([match("# "), to(eol)]),
      ([, text]) => [TokenKind.sectionHeader, text] as const
    );
    return chain([indent, header] as const)(src).use(
      ([[indent, header], tail]) =>
        contents(indent)(tail).use(
          ([contents, tail]) =>
            r.ok([[TokenKind.section, { header, contents }], tail]),
          (it) => r.err(it)
        ),
      (it) => r.err(it)
    );
  };
  const content = (indent: Indent) =>
    convert(
      chain([match(indent[1]), or([section, line])]), // TODO: return never nannde?
      ([indent, content]) => content
    );
  const contents = (indent: Indent = [TokenKind.indent, ""]) =>
    repeat(content(indent));
  return contents()(text);
};
export { parse };

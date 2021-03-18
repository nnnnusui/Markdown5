import {
  Parser,
  Parsers,
  TupledParsersResult,
  ParsersSrc,
  UnifiedParsersResult,
  Tail,
} from "./Types";

export const any = <Src>(): Parser<Src, Src> => <Src>(src: Src[]) => {
  const [head, ...tails] = src;
  return { ok: true, head, tails };
};
export const same = <Src>(it: Src): Parser<Src, Src> => (src: Src[]) => {
  const { head, tails } = any<Src>()(src);
  return { ok: it === head, head, tails };
};

export const not = <T, Src>(parser: Parser<T, Src>): Parser<T, Src> => (
  src: Src[]
) => {
  const { ok, ...results } = parser(src);
  return { ok: !ok, ...results };
};
export const repeat = <T, Src>(source: Parser<T, Src>): Parser<T[], Src> => (
  src: Src[]
) => {
  const recursion = (src: Src[], results: T[]): [T[], Src[]] => {
    const result = source(src);
    if (!result.ok) return [results, src];
    const { head, tails } = result;
    const next = [...results, head];
    if (tails.length <= 0) return [next, tails];
    return recursion(tails, next);
  };
  const [results, tails] = recursion(src, []);
  return { ok: true, head: results, tails };
};
export const convert = <Src, Before, After>(
  parser: Parser<Before, Src>,
  func: (before: Before) => After
): Parser<After, Src> => (src) => {
  const { ok, head, tails } = parser(src);
  if (!ok) return { ok, head, tails } as any; // power
  return { ok, head: func(head), tails };
};

export const chain = <T extends Parsers<any>>(
  ...parsers: T
): Parser<TupledParsersResult<typeof parsers>, ParsersSrc<T>> => (
  src: ParsersSrc<T>[]
) => {
  const recursion = (
    index: number,
    src: ParsersSrc<T>[],
    results: UnifiedParsersResult<typeof parsers>[]
  ): any => {
    // power
    if (parsers.length <= index) return { ok: true, head: results, tails: src };
    const result = parsers[index](src);
    if (!result.ok) return { ok: false, head: results, tails: src };
    const { head, tails } = result;
    return recursion(index + 1, tails, [...results, head]);
  };
  return recursion(0, src, []);
};
export const chainR = <T extends Parsers<any>>(
  ...parsers: T
): Parser<Tail<TupledParsersResult<typeof parsers>>, ParsersSrc<T>> =>
  convert(
    chain(...parsers),
    (it) => it.reverse()[0] as Tail<TupledParsersResult<typeof parsers>>
  );
export const chainL = <T extends Parsers<any>>(
  ...parsers: T
): Parser<TupledParsersResult<typeof parsers>, ParsersSrc<T>> =>
  convert(chain(...parsers), (it) => it[0]);

export const or = <T extends Parsers<any>>(
  ...parsers: T
): Parser<UnifiedParsersResult<typeof parsers>, ParsersSrc<T>> => (
  src: ParsersSrc<T>[]
) => {
  const recursion = (index: number): any => {
    // power
    if (parsers.length <= index) return { ok: false, head: [], tails: src };
    const result = parsers[index](src);
    if (result.ok) return result;
    return recursion(index + 1);
  };
  return recursion(0);
};

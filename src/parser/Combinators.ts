import Result from "../type/Result";
import { Parser, TupledParsersResult, UnifiedParsersResult } from "./Types";

export const ParseResult = Result<any, string>();
const r = ParseResult;
const slice = (src: string, length: number) => {
  const head = src.slice(0, length);
  const tail = src.slice(length);
  return [head, tail] as const;
};

export const parser = <T>(parse: Parser<T>): Parser<T> => (src: string) =>
  parse(src);

export const any = parser((src: string) => r.ok(slice(src, 1)));
export const same = (it: string) =>
  parser<string>((src) => {
    const sliced = slice(src, it.length);
    if (it === sliced[0]) return r.ok(sliced);
    return r.err(`error on match: [${sliced[0]}] should be [${it}]`);
  });
export const not = (it: string) =>
  parser<string>((src) => {
    const sliced = slice(src, it.length);
    if (it !== sliced[0]) return r.ok(sliced);
    return r.err(`error on not:[${sliced[0]}] should not be [${it}]`);
  });

export const repeat = <T>(source: Parser<T>) =>
  parser<T[]>((src) => {
    const recursion = (src: string, results: T[]): [T[], string] =>
      source(src).use(
        ([head, tail]) => {
          const next = [...results, head];
          if (tail === "") return [next, tail];
          return recursion(tail, [...results, head]);
        },
        () => [results, src]
      );
    const [results, tail] = recursion(src, []);
    return r.ok([results, tail]);
  });

type Parsers = readonly Parser<any>[];
export const chain = <T extends Parsers>(...parsers: T) =>
  parser<TupledParsersResult<T>>((src) => {
    const recursion = (
      index: number,
      src: string,
      results: UnifiedParsersResult<T>[]
    ): ReturnType<Parser<TupledParsersResult<T>>> => {
      if (parsers.length <= index) return r.ok([results, src]);
      return parsers[index](src).use(
        ([head, tail]) => recursion(index + 1, tail, [...results, head]),
        (it) => r.err(it)
      );
    };
    return recursion(0, src, []);
  });
export const or = <T extends Parsers>(...parsers: T) =>
  parser<UnifiedParsersResult<T>>((src) => {
    const recursion = (
      index: number
    ): ReturnType<Parser<UnifiedParsersResult<T>>> => {
      if (parsers.length <= index)
        return r.err(`error on or: not match [${parsers}]`);
      return parsers[index](src).use(
        (it) => r.ok(it),
        () => recursion(index + 1)
      );
    };
    return recursion(0);
  });

export const convert = <Before, After>(
  parser: Parser<Before>,
  func: (before: Before) => After
): Parser<After> => (src) =>
  parser(src).use(
    ([result, tail]) => r.ok([func(result), tail]),
    (it) => r.err(it)
  );

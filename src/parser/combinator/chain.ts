import {
  Parsers,
  Parser,
  TupledParsersResult,
  ParsersSrc,
  UnifiedParsersResult,
} from "../Types";

const chain = <T extends Parsers<any>>(
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
export default chain;

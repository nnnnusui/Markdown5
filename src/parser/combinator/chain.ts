import {
  Parsers,
  Parser,
  TupledParsersResult,
  ParsersSrc,
  UnifiedParsersResult,
  Source,
} from "../Types";

const chain = <T extends Parsers<any>>(
  ...parsers: T
): Parser<TupledParsersResult<typeof parsers>, ParsersSrc<T>> => (src) => {
  const recursion = (
    index: number,
    src: Source<ParsersSrc<T>>,
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

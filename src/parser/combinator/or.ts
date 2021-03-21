import { Parsers, Parser, UnifiedParsersResult, ParsersSrc } from "../Types";

const or = <T extends Parsers<any>>(
  ...parsers: T
): Parser<UnifiedParsersResult<typeof parsers>, ParsersSrc<T>> => (src) => {
  const recursion = (index: number): any => {
    // power
    if (parsers.length <= index) return { ok: false, head: [], tails: src };
    const result = parsers[index](src);
    if (result.ok) return result;
    return recursion(index + 1);
  };
  return recursion(0);
};
export default or;

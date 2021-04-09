import { Combinator, ok, Source } from "../Types";

const repeat = <T, Src>(
  combinator: Combinator<T, Src>
): Combinator<T[], Src> => (src) => {
  const recursion = (
    src: Source<Src>,
    result: T[] = []
  ): ReturnType<Combinator<T[], Src>> => {
    const current = combinator(src);
    if (!current.ok) return ok({ head: result, tail: src });
    const { head, tail } = current.get;
    return recursion(tail, [...result, head]);
  };
  return recursion(src);
};
export default repeat;

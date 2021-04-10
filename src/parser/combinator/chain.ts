import {
  AnyCombinators,
  Combinator,
  Src,
  TupledHead,
  ok,
  UnifiedHead,
} from "../Types";

const chain = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<TupledHead<T>, Src<T>> => (src) => {
  const result = combinators.reduce<
    ReturnType<Combinator<UnifiedHead<T>[], Src<T>>>
  >((result, it) => {
    if (!result.ok) return result;
    const current = it(result.get.tail);
    if (!current.ok) return current;
    const { head, tail } = current.get;
    return ok({ head: [...result.get.head, head], tail });
  }, ok({ head: [], tail: src }));
  return result as ReturnType<Combinator<TupledHead<T>, Src<T>>>; // power
};
export default chain;

import {
  AnyCombinators,
  Combinator,
  Src,
  TupledHead,
  ok,
  UnifiedHead,
} from "../Types";
import convert from "./convert";

const chain = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<TupledHead<T>, Src<T>> => (src) => {
  const [first, ...others] = combinators;
  const result = others.reduce<
    ReturnType<Combinator<UnifiedHead<T>[], Src<T>>>
  >((result, it) => {
    if (!result.ok) return result;
    const current = it(result.get.tail);
    if (!current.ok) return current;
    const { head, tail } = current.get;
    return ok({ head: [...result.get.head, head], tail });
  }, convert(first, (it) => [it])(src));
  return result as ReturnType<Combinator<TupledHead<T>, Src<T>>>; // power
};
export default chain;

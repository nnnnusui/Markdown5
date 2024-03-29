import Result from "../../type/Result";
import { AnyCombinators, Combinator, Src, UnifiedHead } from "../Types";

const or = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<UnifiedHead<T>, Src<T>> => (src) => {
  return combinators.reduce<ReturnType<Combinator<UnifiedHead<T>, Src<T>>>>(
    (result, it) => {
      if (result.ok) return result;
      const current = it(src);
      if (!current.ok) return result;
      return current;
    },
    Result.err(src)
  );
};
export default or;

import Result from "../../type/Result";
import { Combinator } from "../Types";

const option = <T, Src>(
  combinator: Combinator<T, Src>
): Combinator<T | null, Src> => (src) => {
  const result = combinator(src);
  if (result.ok) return result;
  return Result.ok({ head: null, tail: src });
};
export default option;

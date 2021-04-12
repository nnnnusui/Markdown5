import Result from "../../type/Result";
import { Combinator } from "../Types";

const higher = <T, Src>(
  from: Combinator<Src[], Src>,
  inner: Combinator<T, Src>
): Combinator<T, Src> => (src) => {
  const srcResult = from(src);
  if (!srcResult.ok) return srcResult;
  const { head, tail } = srcResult.get;
  const innerResult = inner({ ...src, values: head });
  if (!innerResult.ok) return innerResult;
  return Result.ok({ ...innerResult.get, tail });
};
export default higher;

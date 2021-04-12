import Result from "../../type/Result";
import { Combinator } from "../Types";

const use = <T, Middle, Src>(
  from: Combinator<Middle, Src>,
  user: (from: Middle) => Combinator<T, Src> | null
): Combinator<T, Src> => (src) => {
  const srcResult = from(src);
  if (!srcResult.ok) return srcResult;
  const { head, tail } = srcResult.get;
  const uses = user(head);
  if (!uses) return Result.err(src);
  return uses(tail);
};
export default use;

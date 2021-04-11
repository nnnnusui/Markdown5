import Result from "../../type/Result";
import { Combinator } from "../Types";

const convert = <Src, Before, After>(
  combinator: Combinator<Before, Src>,
  func: (before: Before, offset: number) => After
): Combinator<After, Src> => (src) => {
  const result = combinator(src);
  if (!result.ok) return result;
  const { head, tail } = result.get;
  return Result.ok({ head: func(head, src.offset), tail });
};
export default convert;

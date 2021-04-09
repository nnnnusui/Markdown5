import { Combinator, ok } from "../Types";

const convert = <Src, Before, After>(
  combinator: Combinator<Before, Src>,
  func: (before: Before, offset: number) => After
): Combinator<After, Src> => (src) => {
  const result = combinator(src);
  if (!result.ok) return result;
  const { head, tail } = result.get;
  return ok({ head: func(head, src.offset), tail });
};
export default convert;

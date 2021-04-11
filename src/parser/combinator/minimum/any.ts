import Result from "../../../type/Result";
import { Combinator } from "../../Types";

const any = <Src>(): Combinator<Src, Src> => (src) => {
  const {
    values: [head, ...tails],
    offset,
  } = src;
  if (!head) return Result.err(src);
  return Result.ok({ head, tail: { values: tails, offset: offset + 1 } });
};
export default any;

import Result from "../../type/Result";
import { Combinator } from "../Types";

const not = <T, Src>(combinator: Combinator<T, Src>): Combinator<null, Src> => (
  src
) =>
  combinator(src).ok ? Result.err(src) : Result.ok({ head: null, tail: src });
export default not;

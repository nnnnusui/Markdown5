import { AnyCombinators, Src, TupledHead, Combinator } from "../Types";
import chain from "./chain";
import convert from "./convert";

const chainL = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<TupledHead<T>[0], Src<T>> =>
  convert(chain(...combinators), (it) => it[0]);

export default chainL;

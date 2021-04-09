import { AnyCombinators, Combinator, Src, TupledHead } from "../Types";
import chain from "./chain";
import convert from "./convert";

type Last<T extends any[]> = T extends [...any, infer Last] ? Last : never;
const chainR = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<Last<TupledHead<T>>, Src<T>> =>
  convert(chain(...combinators), (it) => it.reverse()[0]);
export default chainR;

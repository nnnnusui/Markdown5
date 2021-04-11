import { AnyCombinators, Combinator, Src, TupledHead } from "../Types";
import chain from "./chain";
import convert from "./convert";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Last<T extends any[]> = T extends [...any, infer Last] ? Last : never;

const chainR = <T extends AnyCombinators>(
  ...combinators: T
): Combinator<Last<TupledHead<T>>, Src<T>> =>
  convert(chain(...combinators), (it) => it.reverse()[0]);
export default chainR;

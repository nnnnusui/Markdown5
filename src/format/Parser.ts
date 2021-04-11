import { Token } from "..";
import init from "../parser/combinator/util/init";
import { Combinator } from "../parser/Types";
import Char from "./Char";
import markdown5 from "./combinator/markdown5";

type Parser<T> = Combinator<T, Char>;
export default Parser;

export const parse = (src: string): ReturnType<Parser<Token<"markdown5">>> =>
  init(markdown5)(src.chars());

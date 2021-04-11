import chainL from "../../parser/combinator/chainL";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import any from "../../parser/combinator/minimum/any";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import repeat from "../../parser/combinator/repeat";
import Char from "../Char";
import Parser from "../Parser";

const to = <T>(combinator: Parser<T>, optional = true): Parser<string> => {
  const tail = optional ? option(combinator) : combinator;
  const content = repeat(chainR(not(combinator), any<Char>()));
  return convert(chainL(content, tail), (it) => it.join(""));
};
export default to;

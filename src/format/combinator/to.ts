import chain from "../../parser/combinator/chain";
import chainR from "../../parser/combinator/chainR";
import convert from "../../parser/combinator/convert";
import any from "../../parser/combinator/minimum/any";
import not from "../../parser/combinator/not";
import option from "../../parser/combinator/option";
import repeat from "../../parser/combinator/repeat";
import { Combinator } from "../../parser/Types";

const to = <T, Src>(combinator: Combinator<T, Src>): Combinator<Src[], Src> => {
  const content = repeat(chainR(not(combinator), any<Src>()));
  return convert(chain(content, option(combinator)), ([content]) => content);
};
export default to;

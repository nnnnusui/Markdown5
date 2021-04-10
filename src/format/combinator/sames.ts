import chain from "../../parser/combinator/chain";
import convert from "../../parser/combinator/convert";
import same from "../../parser/combinator/minimum/same";
import Parser, { Char } from "../Parser";

const sames = (it: string): Parser<string> => {
  const sames = it
    .chars()
    .reduce<Parser<Char>[]>((sum, it) => [...sum, same(it)], []);
  return convert(chain(...sames), (it) => it.join(""));
};
export default sames;

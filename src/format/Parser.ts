import { convert, repeat, not, chain, same, or } from "../parser/Combinators";
import { Parser } from "../parser/Types";

const to = <T, Src>(parser: Parser<T, Src>): Parser<Src[], Src> => {
  const content = repeat(not(parser));
  const hasTail = convert(chain(content, parser), ([content]) => content);
  return or(hasTail, content);
};
const eol = same("\n");
const line = to(eol);

export const parse = (src: string) => line(src.split(""));

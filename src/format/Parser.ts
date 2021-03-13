import { convert, repeat, not, chain, same, or } from "../parser/Combinators";
import { Parser } from "../parser/Types";

type Char = string & { length: 1 };
declare global {
  interface String {
    char(): Char;
    chars(): Char[];
  }
}
String.prototype[`char`] = function () {
  return this.charAt(0) as Char;
};
String.prototype[`chars`] = function () {
  return this.split("") as Char[];
};

const to = <T, Src>(parser: Parser<T, Src>): Parser<Src[], Src> => {
  const content = repeat(not(parser));
  const hasTail = convert(chain(content, parser), ([content]) => content);
  return or(hasTail, content);
};
const eol = same("\n".char());
const line = to(eol);

export const parse = (src: string) => line(src.chars());

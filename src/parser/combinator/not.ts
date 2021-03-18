import { Parser } from "../Types";

const not = <T, Src>(parser: Parser<T, Src>): Parser<null, Src> => (
  src: Src[]
) => {
  const { ok } = parser(src);
  return { ok: !ok, head: null, tails: src };
};
export default not;

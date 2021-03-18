import { Parser } from "../Types";

const not = <T, Src>(parser: Parser<T, Src>): Parser<T, Src> => (
  src: Src[]
) => {
  const { ok, ...results } = parser(src);
  return { ok: !ok, ...results };
};
export default not;

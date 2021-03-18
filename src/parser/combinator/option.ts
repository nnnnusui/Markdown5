import { Parser } from "../Types";

const option = <T, Src>(parser: Parser<T, Src>): Parser<T | null, Src> => (
  src: Src[]
) => {
  const result = parser(src);
  if (result.ok) return result;
  return { ok: true, head: null, tails: src };
};
export default option;

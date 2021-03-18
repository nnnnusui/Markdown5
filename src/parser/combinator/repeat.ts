import { Parser } from "../Types";

const repeat = <T, Src>(source: Parser<T, Src>): Parser<T[], Src> => (
  src: Src[]
) => {
  const recursion = (src: Src[], results: T[]): [T[], Src[]] => {
    const result = source(src);
    if (!result.ok) return [results, src];
    const { head, tails } = result;
    const next = [...results, head];
    if (tails.length <= 0) return [next, tails];
    return recursion(tails, next);
  };
  const [results, tails] = recursion(src, []);
  return { ok: true, head: results, tails };
};
export default repeat;

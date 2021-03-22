import { Parser } from "../Types";

const convert = <Src, Before, After>(
  parser: Parser<Before, Src>,
  func: (before: Before, offset: number) => After
): Parser<After, Src> => (src) => {
  const { ok, head, tails } = parser(src);
  if (!ok) return { ok, head, tails } as any; // power
  return { ok, head: func(head, src.offset), tails };
};
export default convert;

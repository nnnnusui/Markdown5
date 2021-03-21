import { Parser } from "../../Types";

const any = <Src>(): Parser<Src, Src> => (src) => {
  const {
    values: [head, ...tails],
    offset,
  } = src;
  return { ok: true, head, tails: { values: tails, offset: offset + 1 } };
};
export default any;

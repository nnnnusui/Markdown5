import { Combinator, ok } from "../../Types";

const any = <Src>(): Combinator<Src, Src> => (src) => {
  const {
    values: [head, ...tails],
    offset,
  } = src;
  return ok({ head, tail: { values: tails, offset: offset + 1 } });
};
export default any;

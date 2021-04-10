import { Combinator, err, ok } from "../../Types";

const any = <Src>(): Combinator<Src, Src> => (src) => {
  const {
    values: [head, ...tails],
    offset,
  } = src;
  if (!head) return err(src);
  return ok({ head, tail: { values: tails, offset: offset + 1 } });
};
export default any;

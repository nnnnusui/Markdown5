import { Combinator, err, ok } from "../Types";

const not = <T, Src>(combinator: Combinator<T, Src>): Combinator<null, Src> => (
  src
) => (combinator(src).ok ? err(src) : ok({ head: null, tail: src }));
export default not;

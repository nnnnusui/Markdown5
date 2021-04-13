import { Combinator } from "../Types";

const lazy = <T, Src>(
  getCombinator: () => Combinator<T, Src>
): Combinator<T, Src> => {
  let mayBecombinator: Combinator<T, Src> | null;
  return (src) => {
    if (!mayBecombinator) mayBecombinator = getCombinator();
    return mayBecombinator(src);
  };
};
export default lazy;
